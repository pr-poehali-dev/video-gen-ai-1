'''
Business: Генерация видео, изображений и текста через AIML API (kling2.5)
Args: event с httpMethod, body с action (start_video/check_video/start_image/check_image/text)
Returns: HTTP response с task_id или результатом
'''

import json
import os
import requests
from typing import Dict, Any

AIML_API_KEY = os.environ.get('AIMLAPI_KEY', '')
AIML_BASE_URL = 'https://api.aimlapi.com'


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
    
    try:
        if action == 'start_video':
            result = start_video_generation(body_data)
        elif action == 'check_video':
            result = check_video_status(body_data)
        elif action == 'start_image':
            result = start_image_generation(body_data)
        elif action == 'check_image':
            result = check_image_status(body_data)
        elif action == 'text':
            result = generate_text(body_data)
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
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(result)
        }
    except Exception as e:
        print(f'[ERROR] {action}: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }


def start_video_generation(body: Dict[str, Any]) -> Dict[str, Any]:
    prompt = body.get('prompt', '')
    
    if not prompt:
        raise ValueError('Prompt is required')
    
    print(f'[VIDEO] Starting generation: {prompt[:100]}')
    
    response = requests.post(
        f'{AIML_BASE_URL}/v2/generate/video/kling/generation',
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
        raise Exception(f'AIML API error [{response.status_code}]: {response.text}')
    
    data = response.json()
    task_id = data.get('task_id') or data.get('id')
    
    if not task_id:
        raise Exception(f'No task_id in response: {json.dumps(data)}')
    
    print(f'[VIDEO] Task created: {task_id}')
    
    return {
        'task_id': task_id,
        'status': 'processing'
    }


def check_video_status(body: Dict[str, Any]) -> Dict[str, Any]:
    task_id = body.get('task_id', '')
    
    if not task_id:
        raise ValueError('task_id is required')
    
    response = requests.get(
        f'{AIML_BASE_URL}/v2/generate/video/kling/{task_id}',
        headers={
            'Authorization': f'Bearer {AIML_API_KEY}'
        },
        timeout=15
    )
    
    if response.status_code != 200:
        raise Exception(f'AIML API error [{response.status_code}]: {response.text}')
    
    data = response.json()
    status = data.get('status', 'unknown').lower()
    
    print(f'[VIDEO] Task {task_id}: {status}')
    
    if status in ('succeeded', 'completed', 'done'):
        video_url = data.get('output', {}).get('video_url') or data.get('url')
        
        if not video_url:
            raise Exception(f'No video URL in completed response: {json.dumps(data)}')
        
        return {
            'status': 'completed',
            'video_url': video_url
        }
    elif status in ('failed', 'error', 'canceled'):
        error_msg = data.get('error', {}).get('message', 'Unknown error')
        return {
            'status': 'failed',
            'message': error_msg
        }
    else:
        return {
            'status': 'processing'
        }


def start_image_generation(body: Dict[str, Any]) -> Dict[str, Any]:
    prompt = body.get('prompt', '')
    size = body.get('size', '1024x1024')
    
    if not prompt:
        raise ValueError('Prompt is required')
    
    response = requests.post(
        f'{AIML_BASE_URL}/v1/images/generations',
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
        raise Exception(f'AIML API error [{response.status_code}]: {response.text}')
    
    data = response.json()
    task_id = data.get('request_id') or data.get('id')
    
    if not task_id:
        raise Exception(f'No task_id in response: {json.dumps(data)}')
    
    return {
        'task_id': task_id,
        'status': 'processing'
    }


def check_image_status(body: Dict[str, Any]) -> Dict[str, Any]:
    task_id = body.get('task_id', '')
    
    if not task_id:
        raise ValueError('task_id is required')
    
    response = requests.get(
        f'{AIML_BASE_URL}/v1/images/{task_id}',
        headers={
            'Authorization': f'Bearer {AIML_API_KEY}'
        },
        timeout=15
    )
    
    if response.status_code != 200:
        return {'status': 'error', 'message': f'HTTP {response.status_code}'}
    
    data = response.json()
    status = data.get('status', 'unknown').lower()
    
    if status in ('succeeded', 'completed', 'done'):
        image_url = data.get('data', [{}])[0].get('url')
        
        if not image_url:
            return {'status': 'error', 'message': 'No image URL in response'}
        
        try:
            img_response = requests.get(image_url, timeout=60)
            img_response.raise_for_status()
            import base64
            img_b64 = base64.b64encode(img_response.content).decode('utf-8')
            return {
                'status': 'completed',
                'image_b64': img_b64
            }
        except Exception as e:
            return {'status': 'error', 'message': f'Failed to fetch image: {str(e)}'}
    
    elif status in ('failed', 'error', 'canceled'):
        error_msg = data.get('error', {}).get('message', 'Unknown error')
        return {'status': 'failed', 'message': error_msg}
    else:
        return {'status': 'processing'}


def generate_text(body: Dict[str, Any]) -> Dict[str, Any]:
    prompt = body.get('prompt', '')
    system_prompt = body.get('system_prompt', '')
    
    if not prompt:
        raise ValueError('Prompt is required')
    
    messages = []
    if system_prompt:
        messages.append({'role': 'system', 'content': system_prompt})
    messages.append({'role': 'user', 'content': prompt})
    
    response = requests.post(
        f'{AIML_BASE_URL}/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {AIML_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'gpt-4o-mini',
            'messages': messages,
            'temperature': 0.7
        },
        timeout=60
    )
    
    if response.status_code != 200:
        raise Exception(f'AIML API error [{response.status_code}]: {response.text}')
    
    data = response.json()
    text = data.get('choices', [{}])[0].get('message', {}).get('content', '')
    
    return {
        'text': text
    }
