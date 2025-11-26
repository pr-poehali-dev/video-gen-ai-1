'''
Business: Генерация видео и изображений через AIML API
Args: event с httpMethod, body с action
Returns: HTTP response с результатом генерации
'''

import json
import os
import requests
import base64
from typing import Dict, Any

AIML_API_KEY = os.environ.get('AIMLAPI_KEY', '')


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    if not AIML_API_KEY:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'AIMLAPI_KEY не настроен'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action', '')
    prompt = body_data.get('prompt', '')
    
    try:
        if action == 'video':
            if not prompt:
                raise ValueError('Prompt обязателен')
            
            response = requests.post(
                'https://api.aimlapi.com/v2/generate/video/kling/generation',
                headers={
                    'Authorization': f'Bearer {AIML_API_KEY}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'kling-ai/kling-v1.5/video/standard/text-to-video',
                    'prompt': prompt,
                    'duration': '5',
                    'aspect_ratio': '16:9'
                },
                timeout=30
            )
            
            if response.status_code not in [200, 201, 202]:
                raise Exception(f'API error: {response.text}')
            
            data = response.json()
            task_id = data.get('task_id') or data.get('id')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'task_id': task_id, 'status': 'processing'})
            }
        
        elif action == 'check_video':
            task_id = body_data.get('task_id', '')
            if not task_id:
                raise ValueError('task_id обязателен')
            
            response = requests.get(
                f'https://api.aimlapi.com/v2/generate/video/kling/{task_id}',
                headers={'Authorization': f'Bearer {AIML_API_KEY}'},
                timeout=15
            )
            
            if response.status_code != 200:
                raise Exception(f'API error: {response.text}')
            
            data = response.json()
            status = data.get('status', 'unknown').lower()
            
            if status in ('succeeded', 'completed', 'done'):
                video_url = data.get('output', {}).get('video_url') or data.get('url')
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'status': 'completed', 'video_url': video_url})
                }
            elif status in ('failed', 'error'):
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'status': 'failed'})
                }
            else:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'status': 'processing'})
                }
        
        elif action == 'image':
            if not prompt:
                raise ValueError('Prompt обязателен')
            
            size = body_data.get('size', '1024x1024')
            
            response = requests.post(
                'https://api.aimlapi.com/v1/images/generations',
                headers={
                    'Authorization': f'Bearer {AIML_API_KEY}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'flux/schnell',
                    'prompt': prompt,
                    'size': size,
                    'n': 1
                },
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f'API error: {response.text}')
            
            data = response.json()
            task_id = data.get('request_id') or data.get('id')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'task_id': task_id, 'status': 'processing'})
            }
        
        elif action == 'check_image':
            task_id = body_data.get('task_id', '')
            if not task_id:
                raise ValueError('task_id обязателен')
            
            response = requests.get(
                f'https://api.aimlapi.com/v1/images/{task_id}',
                headers={'Authorization': f'Bearer {AIML_API_KEY}'},
                timeout=15
            )
            
            if response.status_code != 200:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'status': 'processing'})
                }
            
            data = response.json()
            status = data.get('status', 'unknown').lower()
            
            if status in ('succeeded', 'completed', 'done'):
                image_url = data.get('data', [{}])[0].get('url')
                if image_url:
                    img_response = requests.get(image_url, timeout=60)
                    img_b64 = base64.b64encode(img_response.content).decode('utf-8')
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'status': 'completed', 'image_b64': img_b64})
                    }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'status': 'processing'})
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Unknown action: {action}'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
