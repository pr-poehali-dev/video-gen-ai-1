import json
import os
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Универсальная генерация контента через OpenAI, Replicate и Stability AI
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
    
    try:
        if content_type == 'image':
            result = generate_image(prompt, params, context)
        elif content_type == 'video':
            result = generate_video(prompt, params, context)
        elif content_type == 'text':
            result = generate_text(prompt, params, context)
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


def generate_image(prompt: str, params: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''Генерация изображений через OpenAI DALL-E или Stability AI'''
    provider = params.get('provider', 'openai')
    
    if provider == 'stability':
        api_key = os.environ.get('STABILITY_API_KEY')
        if not api_key:
            raise Exception('Stability API key not configured')
        
        response = requests.post(
            'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'text_prompts': [{'text': prompt}],
                'cfg_scale': params.get('cfg_scale', 7),
                'height': params.get('height', 1024),
                'width': params.get('width', 1024),
                'samples': 1,
                'steps': params.get('steps', 30)
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                'url': data['artifacts'][0]['base64'],
                'type': 'image',
                'provider': 'stability',
                'prompt': prompt,
                'request_id': context.request_id
            }
        else:
            raise Exception(f'Stability API error: {response.text}')
    
    else:
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            raise Exception('OpenAI API key not configured')
        
        response = requests.post(
            'https://api.openai.com/v1/images/generations',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'dall-e-3',
                'prompt': prompt,
                'n': 1,
                'size': params.get('size', '1024x1024'),
                'quality': params.get('quality', 'standard'),
                'style': params.get('style', 'vivid')
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                'url': data['data'][0]['url'],
                'type': 'image',
                'provider': 'openai',
                'prompt': prompt,
                'request_id': context.request_id
            }
        else:
            raise Exception(f'OpenAI API error: {response.text}')


def generate_video(prompt: str, params: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''Генерация видео через Replicate'''
    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        raise Exception('Replicate API token not configured')
    
    response = requests.post(
        'https://api.replicate.com/v1/predictions',
        headers={
            'Authorization': f'Token {api_token}',
            'Content-Type': 'application/json'
        },
        json={
            'version': 'stable-video-diffusion',
            'input': {
                'prompt': prompt,
                'num_frames': params.get('num_frames', 25),
                'fps': params.get('fps', 6)
            }
        }
    )
    
    if response.status_code in [200, 201]:
        data = response.json()
        return {
            'prediction_id': data.get('id'),
            'status': data.get('status', 'processing'),
            'type': 'video',
            'provider': 'replicate',
            'prompt': prompt,
            'request_id': context.request_id
        }
    else:
        raise Exception(f'Replicate API error: {response.text}')


def generate_text(prompt: str, params: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''Генерация текста через OpenAI GPT-4'''
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        raise Exception('OpenAI API key not configured')
    
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': params.get('model', 'gpt-4'),
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
            'provider': 'openai',
            'prompt': prompt,
            'request_id': context.request_id
        }
    else:
        raise Exception(f'OpenAI API error: {response.text}')
