import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Универсальная генерация контента через aimlapi.com
    Args: event - dict с httpMethod, body (type: image/video/text, prompt, params)
          context - object с request_id, function_name
    Returns: HTTP response с URL контента или ошибкой
    '''
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
            'body': ''
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
    
    body_data = json.loads(event.get('body', '{}'))
    content_type = body_data.get('type', 'image')
    prompt = body_data.get('prompt', '')
    params = body_data.get('params', {})
    
    if not prompt:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Prompt is required'})
        }
    
    api_key = os.environ.get('AIMLAPI_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'AIMLAPI key not configured'})
        }
    
    try:
        if content_type == 'image':
            result = generate_image(prompt, params, context, api_key)
        elif content_type == 'video':
            result = generate_video(prompt, params, context, api_key)
        elif content_type == 'text':
            result = generate_text(prompt, params, context, api_key)
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid type. Use: image, video, or text'})
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
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }


def generate_image(prompt: str, params: Dict[str, Any], context: Any, api_key: str) -> Dict[str, Any]:
    '''Генерация изображений через AIML API (Flux, Stable Diffusion)'''
    model = params.get('model', 'flux/schnell')
    
    response = requests.post(
        'https://api.aimlapi.com/images/generations',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': model,
            'prompt': prompt,
            'n': 1,
            'size': params.get('size', '1024x1024')
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        return {
            'url': data['data'][0]['url'],
            'type': 'image',
            'provider': 'aimlapi',
            'model': model,
            'prompt': prompt,
            'request_id': context.request_id
        }
    else:
        raise Exception(f'AIML API error: {response.text}')


def generate_video(prompt: str, params: Dict[str, Any], context: Any, api_key: str) -> Dict[str, Any]:
    '''Генерация видео через AIML API'''
    response = requests.post(
        'https://api.aimlapi.com/v1/video/generation',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'prompt': prompt,
            'duration': params.get('duration', 5),
            'resolution': params.get('resolution', '1024x576')
        }
    )
    
    if response.status_code in [200, 201, 202]:
        data = response.json()
        return {
            'video_id': data.get('id', context.request_id),
            'status': data.get('status', 'processing'),
            'type': 'video',
            'provider': 'aimlapi',
            'prompt': prompt,
            'request_id': context.request_id
        }
    else:
        raise Exception(f'AIML API error: {response.text}')


def generate_text(prompt: str, params: Dict[str, Any], context: Any, api_key: str) -> Dict[str, Any]:
    '''Генерация текста через AIML API (GPT-4, Claude и др.)'''
    model = params.get('model', 'gpt-4o')
    
    response = requests.post(
        'https://api.aimlapi.com/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': model,
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': params.get('temperature', 0.7),
            'max_tokens': params.get('max_tokens', 1000)
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        return {
            'text': data['choices'][0]['message']['content'],
            'type': 'text',
            'provider': 'aimlapi',
            'model': model,
            'prompt': prompt,
            'request_id': context.request_id
        }
    else:
        raise Exception(f'AIML API error: {response.text}')
