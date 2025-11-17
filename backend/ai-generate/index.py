'''
Генерация контента через нейросети: видео, тексты, презентации
'''
import json
import os
import time
from typing import Dict, Any, Optional
import requests
from dataclasses import dataclass

def get_replicate_key():
    '''Получить API ключ Replicate из переменных окружения'''
    return os.environ.get('REPLICATE_API_TOKEN', '')

def has_replicate_access():
    '''Проверить наличие API ключа Replicate'''
    return bool(get_replicate_key())

@dataclass
class GenerationResult:
    success: bool
    content_url: Optional[str] = None
    error: Optional[str] = None
    generation_id: Optional[str] = None
    is_demo: bool = False



def generate_video_replicate_pro(prompt: str, duration: int = 5) -> GenerationResult:
    '''Профессиональная генерация видео через Replicate Hotshot-XL'''
    api_token = get_replicate_key()
    print(f'DEBUG: API Token exists={bool(api_token)}, prompt={prompt[:50]}')
    if not has_replicate_access():
        print('DEBUG: No API token found!')
        return GenerationResult(
            success=False,
            error='Для генерации видео требуется REPLICATE_API_TOKEN. Получите ключ на https://replicate.com/account/api-tokens и добавьте в секреты проекта.'
        )
    
    try:
        # Переводим на английский если есть кириллица
        if any('а' <= c.lower() <= 'я' for c in prompt):
            translated_prompt = translate_to_english(prompt)
        else:
            translated_prompt = prompt
        
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
        
        # Улучшенный промпт для максимального качества
        enhanced_prompt = (
            f'{translated_prompt}, '
            'ultra cinematic video, hollywood production quality, '
            'professional cinematography, smooth fluid motion, '
            'dynamic camera movement, perfect lighting, '
            'ultra high definition 4k, crystal clear details, '
            'film grain, color grading, masterpiece quality, '
            'photorealistic rendering, natural movement, '
            'professional color correction, cinematic depth of field'
        )
        print(f'DEBUG: Enhanced prompt: {enhanced_prompt[:100]}')
        
        # Используем Zeroscope v2 XL для text-to-video (реальные MP4, не GIF)
        # Длительность зависит от параметра duration (по умолчанию 5 секунд)
        num_frames = min(duration * 8, 120)  # 8 кадров в секунду, макс 120 кадров (~15 сек)
        
        payload = {
            'version': 'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
            'input': {
                'prompt': enhanced_prompt,
                'num_frames': num_frames,
                'num_inference_steps': 50,
                'fps': 8,
                'model': 'xl',
                'width': 1024,
                'height': 576,
                'init_weight': 0.5,
                'guidance_scale': 17.5,
                'negative_prompt': 'low quality, worst quality, deformed, distorted, blurry, bad anatomy'
            }
        }
        
        print(f'DEBUG: Generating video with {num_frames} frames (~{num_frames/8:.1f} seconds at 8fps)')
        
        print(f'DEBUG: Calling Replicate API...')
        response = requests.post(
            'https://api.replicate.com/v1/predictions',
            json=payload,
            headers=headers,
            timeout=10
        )
        
        print(f'DEBUG: Replicate response status={response.status_code}')
        if response.status_code != 201:
            print(f'DEBUG: API error: {response.text[:200]}')
            return GenerationResult(
                success=False,
                error=f'Ошибка API Replicate: {response.status_code}. Проверьте токен.'
            )
        
        prediction = response.json()
        prediction_id = prediction['id']
        print(f'DEBUG: Prediction created: {prediction_id}')
        
        # Возвращаем ID для polling на фронте
        return GenerationResult(
            success=True,
            content_url='',  # Пока нет URL
            generation_id=prediction_id,
            is_demo=False
        )
    except Exception as e:
        print(f'DEBUG: Exception: {str(e)}')
        import traceback
        traceback.print_exc()
        return GenerationResult(
            success=False,
            error=f'Ошибка генерации: {str(e)}'
        )










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

def translate_to_english(text: str) -> str:
    '''Перевод русского текста на английский для улучшения генерации'''
    try:
        response = requests.get(
            'https://translate.googleapis.com/translate_a/single',
            params={
                'client': 'gtx',
                'sl': 'ru',
                'tl': 'en',
                'dt': 't',
                'q': text
            },
            timeout=5
        )
        
        if response.status_code == 200:
            result = response.json()
            translated = ''.join([item[0] for item in result[0] if item[0]])
            return translated
        return text
    except Exception:
        return text

def enhance_prompt(prompt: str, style: str = 'photorealistic') -> str:
    '''Улучшение промпта для максимального качества генерации'''
    style_enhancers = {
        'photorealistic': (
            'masterpiece, best quality, ultra high res, RAW photo, 8k uhd, dslr, '
            'professional photography, soft lighting, film grain, photorealistic, '
            'highly detailed, sharp focus, bokeh, natural skin texture, subsurface scattering, '
            'perfect composition, award-winning photograph'
        ),
        'artistic': (
            'masterpiece, best quality, highly detailed, digital art, concept art, '
            'trending on artstation, award winning, beautiful composition, '
            'vivid colors, professional illustration, intricate details'
        ),
        'cartoon': (
            'masterpiece, best quality, 3D render, pixar style, disney animation quality, '
            'vibrant colors, clean lines, professional animation, octane render, '
            'studio lighting, detailed textures, cartoon style'
        ),
        'abstract': (
            'masterpiece, best quality, abstract art, creative composition, modern art, '
            'bold colors, unique style, award-winning design, trending on behance, '
            'professional artwork, intricate patterns'
        )
    }
    
    negative_prompts = (
        'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, '
        'extra digit, fewer digits, cropped, worst quality, low quality, normal quality, '
        'jpeg artifacts, signature, watermark, username, blurry, artist name, '
        'deformed, disfigured, poorly drawn, bad proportions, gross proportions'
    )
    
    enhancer = style_enhancers.get(style, style_enhancers['photorealistic'])
    return f'{prompt}, {enhancer}'

def generate_image_replicate_pro(prompt: str, style: str = 'photorealistic', resolution: str = '1024x1024') -> GenerationResult:
    '''Профессиональная генерация через Replicate FLUX Pro API'''
    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        return GenerationResult(
            success=False,
            error='Для генерации изображений требуется REPLICATE_API_TOKEN. Получите ключ на https://replicate.com/account/api-tokens и добавьте в секреты проекта.'
        )
    
    try:
        translated_prompt = translate_to_english(prompt)
        enhanced_prompt = enhance_prompt(translated_prompt, style)
        
        resolution_map = {
            '1024x1024': {'width': 1024, 'height': 1024},
            '1920x1080': {'width': 1920, 'height': 1080},
            '2560x1440': {'width': 2560, 'height': 1440}
        }
        
        dimensions = resolution_map.get(resolution, {'width': 1024, 'height': 1024})
        
        headers = {
            'Authorization': f'Token {api_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'version': 'black-forest-labs/flux-1.1-pro',
            'input': {
                'prompt': enhanced_prompt,
                'width': dimensions['width'],
                'height': dimensions['height'],
                'num_outputs': 1,
                'aspect_ratio': 'custom',
                'output_format': 'webp',
                'output_quality': 100,
                'safety_tolerance': 2,
                'prompt_upsampling': True
            }
        }
        
        response = requests.post(
            'https://api.replicate.com/v1/predictions',
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 201:
            return GenerationResult(
                success=False,
                error=f'Ошибка API Replicate: {response.status_code}'
            )
        
        prediction = response.json()
        prediction_id = prediction['id']
        
        for _ in range(60):
            time.sleep(2)
            status_response = requests.get(
                f'https://api.replicate.com/v1/predictions/{prediction_id}',
                headers=headers,
                timeout=10
            )
            result = status_response.json()
            
            if result['status'] == 'succeeded':
                output = result.get('output')
                image_url = output[0] if isinstance(output, list) else output
                
                return GenerationResult(
                    success=True,
                    content_url=image_url,
                    generation_id=prediction_id,
                    is_demo=False
                )
            elif result['status'] == 'failed':
                return GenerationResult(
                    success=False,
                    error='Генерация не удалась'
                )
        
        return GenerationResult(
            success=False,
            error='Превышено время ожидания'
        )
    except Exception as e:
        return GenerationResult(
            success=False,
            error=f'Ошибка: {str(e)}'
        )



def generate_presentation_replicate_pro(slide_prompt: str) -> GenerationResult:
    '''Профессиональная генерация слайдов через Replicate FLUX Pro'''
    api_token = os.environ.get('REPLICATE_API_TOKEN')
    if not api_token:
        return GenerationResult(
            success=False,
            error='Для генерации слайдов требуется REPLICATE_API_TOKEN. Получите ключ на https://replicate.com/account/api-tokens и добавьте в секреты проекта.'
        )
    
    try:
        headers = {
            'Authorization': f'Token {api_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'version': 'black-forest-labs/flux-1.1-pro',
            'input': {
                'prompt': f'{slide_prompt}, professional presentation slide, 16:9, high quality, detailed',
                'width': 1920,
                'height': 1080,
                'aspect_ratio': 'custom',
                'output_format': 'png',
                'output_quality': 100,
                'safety_tolerance': 2,
                'prompt_upsampling': False
            }
        }
        
        response = requests.post(
            'https://api.replicate.com/v1/predictions',
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 201:
            return GenerationResult(
                success=False,
                error=f'Ошибка API Replicate: {response.status_code}'
            )
        
        prediction = response.json()
        prediction_id = prediction['id']
        
        for _ in range(60):
            time.sleep(2)
            status_response = requests.get(
                f'https://api.replicate.com/v1/predictions/{prediction_id}',
                headers=headers,
                timeout=10
            )
            result = status_response.json()
            
            if result['status'] == 'succeeded':
                output = result.get('output')
                image_url = output[0] if isinstance(output, list) else output
                
                return GenerationResult(
                    success=True,
                    content_url=image_url,
                    generation_id=prediction_id,
                    is_demo=False
                )
            elif result['status'] == 'failed':
                return GenerationResult(
                    success=False,
                    error='Генерация не удалась'
                )
        
        return GenerationResult(
            success=False,
            error='Превышено время ожидания'
        )
    except Exception as e:
        return GenerationResult(
            success=False,
            error=f'Ошибка: {str(e)}'
        )



def generate_presentation_creatomate(title: str, slides_data: list) -> GenerationResult:
    '''Генерация презентации через Creatomate API'''
    return GenerationResult(
        success=False,
        error='Для генерации презентаций требуется CREATOMATE_API_KEY. Получите ключ на https://creatomate.com и добавьте в секреты проекта.'
    )



def check_prediction_status(prediction_id: str) -> Dict[str, Any]:
    '''Проверка статуса генерации видео на Replicate'''
    api_token = get_replicate_key()
    if not api_token:
        return {
            'status': 'error',
            'error': 'No API token'
        }
    
    try:
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            f'https://api.replicate.com/v1/predictions/{prediction_id}',
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            return {
                'status': 'error',
                'error': f'API error: {response.status_code}'
            }
        
        result = response.json()
        status = result.get('status', 'unknown')
        
        if status == 'succeeded':
            return {
                'status': 'completed',
                'video_url': result.get('output')
            }
        elif status == 'failed':
            return {
                'status': 'failed',
                'error': result.get('error', 'Unknown error')
            }
        else:
            # processing, starting, etc.
            return {
                'status': 'processing',
                'progress': result.get('progress', 0)
            }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }

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
    
    # Проверка статуса генерации
    if method == 'GET' and action == 'check_status':
        prediction_id = params.get('prediction_id', '')
        if not prediction_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Необходимо указать prediction_id'})
            }
        
        status_result = check_prediction_status(prediction_id)
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(status_result)
        }
    
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
            # Всегда используем реальную AI генерацию через Replicate
            result = generate_video_replicate_pro(prompt, duration)
        elif content_type == 'text':
            result = generate_text_openai(prompt)
        elif content_type == 'presentation':
            title = body_data.get('title', 'Презентация')
            slides = body_data.get('slides', [])
            result = generate_presentation_creatomate(title, slides)
        elif content_type == 'presentation_image':
            result = generate_presentation_replicate_pro(prompt)
        elif content_type == 'image':
            style = body_data.get('style', 'photorealistic')
            resolution = body_data.get('resolution', '1024x1024')
            result = generate_image_replicate_pro(prompt, style, resolution)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестный тип контента. Доступные: video, text, presentation, presentation_image, image'})
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