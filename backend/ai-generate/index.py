'''
Генерация контента через нейросети: видео, тексты, презентации
'''
import json
import os
import time
from typing import Dict, Any, Optional
import requests
from dataclasses import dataclass

@dataclass
class GenerationResult:
    success: bool
    content_url: Optional[str] = None
    error: Optional[str] = None
    generation_id: Optional[str] = None

def generate_video_replicate(prompt: str, duration: int = 5) -> GenerationResult:
    '''Генерация видео через Replicate (Stable Video Diffusion)'''
    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        return GenerationResult(success=False, error='REPLICATE_API_TOKEN не настроен')
    
    headers = {
        'Authorization': f'Token {api_token}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'version': 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
        'input': {
            'cond_aug': 0.02,
            'decoding_t': 7,
            'input_image': f'https://image.pollinations.ai/prompt/{requests.utils.quote(prompt)}?width=1024&height=576',
            'video_length': 'auto',
            'sizing_strategy': 'maintain_aspect_ratio',
            'motion_bucket_id': 127,
            'frames_per_second': 24
        }
    }
    
    response = requests.post('https://api.replicate.com/v1/predictions', json=payload, headers=headers)
    
    if response.status_code != 201:
        return GenerationResult(success=False, error=f'Ошибка API: {response.text}')
    
    prediction = response.json()
    prediction_id = prediction['id']
    
    for _ in range(120):
        time.sleep(2)
        status_response = requests.get(
            f'https://api.replicate.com/v1/predictions/{prediction_id}',
            headers=headers
        )
        result = status_response.json()
        
        if result['status'] == 'succeeded':
            return GenerationResult(
                success=True,
                content_url=result['output'],
                generation_id=prediction_id
            )
        elif result['status'] == 'failed':
            return GenerationResult(success=False, error='Генерация не удалась')
    
    return GenerationResult(success=False, error='Таймаут генерации')

def generate_text_openai(prompt: str, max_tokens: int = 2000) -> GenerationResult:
    '''Генерация текста через OpenAI GPT-4'''
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return GenerationResult(success=False, error='OPENAI_API_KEY не настроен')
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': 'gpt-4-turbo-preview',
        'messages': [
            {'role': 'system', 'content': 'Ты помощник для создания качественного контента на русском языке.'},
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': max_tokens,
        'temperature': 0.7
    }
    
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        json=payload,
        headers=headers
    )
    
    if response.status_code != 200:
        return GenerationResult(success=False, error=f'Ошибка API: {response.text}')
    
    result = response.json()
    text_content = result['choices'][0]['message']['content']
    
    return GenerationResult(
        success=True,
        content_url=text_content,
        generation_id=result['id']
    )

def generate_presentation_image(slide_prompt: str) -> GenerationResult:
    '''Генерация изображения для слайда презентации через Stability AI'''
    api_key = os.environ.get('STABILITY_API_KEY')
    if not api_key:
        return GenerationResult(success=False, error='STABILITY_API_KEY не настроен')
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'text_prompts': [
            {'text': f'{slide_prompt}, professional presentation style, clean design, high quality', 'weight': 1}
        ],
        'cfg_scale': 7,
        'height': 1080,
        'width': 1920,
        'samples': 1,
        'steps': 30
    }
    
    response = requests.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        json=payload,
        headers=headers
    )
    
    if response.status_code != 200:
        return GenerationResult(success=False, error=f'Ошибка API: {response.text}')
    
    result = response.json()
    image_base64 = result['artifacts'][0]['base64']
    
    return GenerationResult(
        success=True,
        content_url=f'data:image/png;base64,{image_base64}',
        generation_id=result['artifacts'][0]['seed']
    )

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для генерации контента через нейросети
    Args: event с httpMethod, queryStringParameters (action, prompt, type)
    Returns: Результат генерации с URL контента
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    params = event.get('queryStringParameters', {})
    action = params.get('action', 'generate')
    
    if method == 'POST' and action == 'generate':
        body_data = json.loads(event.get('body', '{}'))
        content_type = body_data.get('type', 'text')
        prompt = body_data.get('prompt', '')
        
        if not prompt:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Необходимо указать prompt'})
            }
        
        if content_type == 'video':
            result = generate_video_replicate(prompt)
        elif content_type == 'text':
            result = generate_text_openai(prompt)
        elif content_type == 'presentation_image':
            result = generate_presentation_image(prompt)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестный тип контента'})
            }
        
        if result.success:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'content_url': result.content_url,
                    'generation_id': result.generation_id,
                    'type': content_type
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': False,
                    'error': result.error
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
