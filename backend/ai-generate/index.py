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
    is_demo: bool = False

def generate_video_creatomate(prompt: str, duration: int = 5) -> GenerationResult:
    '''Генерация видео через Creatomate API'''
    api_key = os.environ.get('CREATOMATE_API_KEY')
    if not api_key:
        return generate_video_demo(prompt)
    
    try:
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'source': {
                'output_format': 'mp4',
                'width': 1920,
                'height': 1080,
                'duration': duration,
                'elements': [
                    {
                        'type': 'text',
                        'text': prompt,
                        'width': '90%',
                        'height': '90%',
                        'x': '50%',
                        'y': '50%',
                        'x_alignment': '50%',
                        'y_alignment': '50%',
                        'font_family': 'Montserrat',
                        'font_weight': '700',
                        'font_size': '8 vmin',
                        'fill_color': '#ffffff',
                        'background_color': '#000000'
                    }
                ]
            }
        }
        
        response = requests.post(
            'https://api.creatomate.com/v1/renders',
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            return generate_video_demo(prompt)
        
        result = response.json()
        
        if not result:
            return generate_video_demo(prompt)
        
        render_data = result[0] if isinstance(result, list) else result
        render_id = render_data.get('id')
        
        for _ in range(60):
            time.sleep(2)
            status_response = requests.get(
                f'https://api.creatomate.com/v1/renders/{render_id}',
                headers=headers,
                timeout=10
            )
            status_data = status_response.json()
            
            if status_data.get('status') == 'succeeded':
                return GenerationResult(
                    success=True,
                    content_url=status_data.get('url'),
                    generation_id=render_id
                )
            elif status_data.get('status') == 'failed':
                return generate_video_demo(prompt)
        
        return generate_video_demo(prompt)
    except Exception:
        return generate_video_demo(prompt)

def generate_video_demo(prompt: str) -> GenerationResult:
    '''Демо-генерация видео через бесплатный API'''
    try:
        safe_prompt = requests.utils.quote(prompt)
        video_url = f'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        
        return GenerationResult(
            success=True,
            content_url=video_url,
            generation_id='demo',
            is_demo=True
        )
    except Exception as e:
        return GenerationResult(success=False, error=str(e))

def generate_video_replicate(prompt: str, duration: int = 5) -> GenerationResult:
    '''Генерация видео через Replicate (Stable Video Diffusion) - fallback'''
    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        return generate_video_creatomate(prompt, duration)
    
    try:
        headers = {
            'Authorization': f'Token {api_token}',
            'Content-Type': 'application/json'
        }
        
        safe_prompt = requests.utils.quote(prompt)
        image_url = f'https://image.pollinations.ai/prompt/{safe_prompt}?width=1024&height=576'
        
        payload = {
            'version': 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
            'input': {
                'cond_aug': 0.02,
                'decoding_t': 7,
                'input_image': image_url,
                'video_length': 'auto',
                'sizing_strategy': 'maintain_aspect_ratio',
                'motion_bucket_id': 127,
                'frames_per_second': 24
            }
        }
        
        response = requests.post('https://api.replicate.com/v1/predictions', json=payload, headers=headers, timeout=10)
        
        if response.status_code != 201:
            return generate_video_demo(prompt)
        
        prediction = response.json()
        prediction_id = prediction['id']
        
        for _ in range(60):
            time.sleep(3)
            status_response = requests.get(
                f'https://api.replicate.com/v1/predictions/{prediction_id}',
                headers=headers,
                timeout=10
            )
            result = status_response.json()
            
            if result['status'] == 'succeeded':
                return GenerationResult(
                    success=True,
                    content_url=result['output'],
                    generation_id=prediction_id
                )
            elif result['status'] == 'failed':
                return generate_video_demo(prompt)
        
        return generate_video_demo(prompt)
    except Exception:
        return generate_video_demo(prompt)

def generate_text_demo(prompt: str) -> GenerationResult:
    '''Демо-генерация текста'''
    demo_text = f'''Это демо-версия генерации текста.

Ваш запрос: "{prompt}"

Для получения реальных текстов от GPT-4:
1. Получите API ключ на https://platform.openai.com
2. Добавьте OPENAI_API_KEY в секреты проекта
3. Пополните баланс минимум на $5

Реальная генерация создаст качественный контент на основе вашего запроса, используя возможности GPT-4 Turbo.

Пример возможностей:
- Статьи и блог-посты любой длины
- Маркетинговые тексты и описания
- Сценарии и креативный контент
- Технические документы и инструкции
- SEO-оптимизированный контент'''

    return GenerationResult(
        success=True,
        content_url=demo_text,
        generation_id='demo',
        is_demo=True
    )

def generate_text_openai(prompt: str, max_tokens: int = 2000) -> GenerationResult:
    '''Генерация текста через OpenAI GPT-4'''
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return generate_text_demo(prompt)
    
    try:
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
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            return generate_text_demo(prompt)
        
        result = response.json()
        text_content = result['choices'][0]['message']['content']
        
        return GenerationResult(
            success=True,
            content_url=text_content,
            generation_id=result['id']
        )
    except Exception:
        return generate_text_demo(prompt)

def generate_presentation_image_demo(slide_prompt: str) -> GenerationResult:
    '''Демо-генерация изображения через бесплатный API'''
    try:
        safe_prompt = requests.utils.quote(f'{slide_prompt}, professional presentation, clean design')
        image_url = f'https://image.pollinations.ai/prompt/{safe_prompt}?width=1920&height=1080&nologo=true'
        
        return GenerationResult(
            success=True,
            content_url=image_url,
            generation_id='demo',
            is_demo=True
        )
    except Exception as e:
        return GenerationResult(success=False, error=str(e))

def generate_presentation_creatomate(title: str, slides_data: list) -> GenerationResult:
    '''Генерация презентации через Creatomate API'''
    api_key = os.environ.get('CREATOMATE_API_KEY')
    if not api_key:
        return generate_presentation_image_demo(title)
    
    try:
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        elements = []
        current_time = 0
        slide_duration = 3
        
        for i, slide in enumerate(slides_data[:10]):
            slide_title = slide.get('title', f'Слайд {i+1}')
            slide_text = slide.get('text', '')
            
            elements.append({
                'type': 'shape',
                'shape': 'rectangle',
                'width': '100%',
                'height': '100%',
                'fill_color': '#1a1a2e',
                'time': current_time,
                'duration': slide_duration
            })
            
            elements.append({
                'type': 'text',
                'text': slide_title,
                'width': '80%',
                'height': 'auto',
                'x': '50%',
                'y': '30%',
                'x_alignment': '50%',
                'y_alignment': '50%',
                'font_family': 'Montserrat',
                'font_weight': '700',
                'font_size': '8 vmin',
                'fill_color': '#ffffff',
                'time': current_time,
                'duration': slide_duration
            })
            
            if slide_text:
                elements.append({
                    'type': 'text',
                    'text': slide_text,
                    'width': '70%',
                    'height': 'auto',
                    'x': '50%',
                    'y': '60%',
                    'x_alignment': '50%',
                    'y_alignment': '50%',
                    'font_family': 'Open Sans',
                    'font_weight': '400',
                    'font_size': '4 vmin',
                    'fill_color': '#e0e0e0',
                    'time': current_time,
                    'duration': slide_duration
                })
            
            current_time += slide_duration
        
        payload = {
            'source': {
                'output_format': 'mp4',
                'width': 1920,
                'height': 1080,
                'duration': current_time,
                'elements': elements
            }
        }
        
        response = requests.post(
            'https://api.creatomate.com/v1/renders',
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            return generate_presentation_image_demo(title)
        
        result = response.json()
        if not result:
            return generate_presentation_image_demo(title)
        
        render_data = result[0] if isinstance(result, list) else result
        render_id = render_data.get('id')
        
        for _ in range(120):
            time.sleep(3)
            status_response = requests.get(
                f'https://api.creatomate.com/v1/renders/{render_id}',
                headers=headers,
                timeout=10
            )
            status_data = status_response.json()
            
            if status_data.get('status') == 'succeeded':
                return GenerationResult(
                    success=True,
                    content_url=status_data.get('url'),
                    generation_id=render_id
                )
            elif status_data.get('status') == 'failed':
                return generate_presentation_image_demo(title)
        
        return generate_presentation_image_demo(title)
    except Exception:
        return generate_presentation_image_demo(title)

def generate_presentation_image(slide_prompt: str) -> GenerationResult:
    '''Генерация изображения для слайда презентации через Stability AI'''
    api_key = os.environ.get('STABILITY_API_KEY')
    if not api_key:
        return generate_presentation_image_demo(slide_prompt)
    
    try:
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
            headers=headers,
            timeout=60
        )
        
        if response.status_code != 200:
            return generate_presentation_image_demo(slide_prompt)
        
        result = response.json()
        image_base64 = result['artifacts'][0]['base64']
        
        return GenerationResult(
            success=True,
            content_url=f'data:image/png;base64,{image_base64}',
            generation_id=str(result['artifacts'][0]['seed'])
        )
    except Exception:
        return generate_presentation_image_demo(slide_prompt)

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
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-User-Token',
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
            duration = body_data.get('duration', 5)
            result = generate_video_creatomate(prompt, duration)
        elif content_type == 'text':
            result = generate_text_openai(prompt)
        elif content_type == 'presentation':
            title = body_data.get('title', 'Презентация')
            slides = body_data.get('slides', [])
            result = generate_presentation_creatomate(title, slides)
        elif content_type == 'presentation_image':
            result = generate_presentation_image(prompt)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестный тип контента. Доступные: video, text, presentation, presentation_image'})
            }
        
        if result.success:
            response_data = {
                'success': True,
                'content_url': result.content_url,
                'generation_id': result.generation_id,
                'type': content_type
            }
            if result.is_demo:
                response_data['is_demo'] = True
                response_data['message'] = 'Используется демо-версия. Добавьте API ключи для реальной генерации.'
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(response_data)
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