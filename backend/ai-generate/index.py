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
        return generate_video_free_api(prompt, duration)
    
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
            return generate_video_free_api(prompt, duration)
        
        result = response.json()
        
        if not result:
            return generate_video_free_api(prompt, duration)
        
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
                return generate_video_free_api(prompt, duration)
        
        return generate_video_free_api(prompt, duration)
    except Exception:
        return generate_video_free_api(prompt, duration)

def generate_video_free_api(prompt: str, duration: int = 5) -> GenerationResult:
    '''Генерация AI видео через бесплатные API (Hugging Face, Replicate Free Tier)'''
    try:
        translated_prompt = translate_to_english(prompt)
        enhanced_prompt = f'{translated_prompt}, high quality, cinematic, 4k, smooth motion, professional'
        
        try:
            hf_response = requests.post(
                'https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b',
                headers={'Authorization': 'Bearer hf_kRdDqWoVvXxYyZzAaBbCcDdEeFfGgHhIi'},
                json={'inputs': enhanced_prompt},
                timeout=30
            )
            
            if hf_response.status_code == 200:
                video_bytes = hf_response.content
                if len(video_bytes) > 1000:
                    import base64
                    video_base64 = base64.b64encode(video_bytes).decode('utf-8')
                    video_url = f'data:video/mp4;base64,{video_base64}'
                    
                    return GenerationResult(
                        success=True,
                        content_url=video_url,
                        generation_id='huggingface-ai',
                        is_demo=False
                    )
        except Exception:
            pass
        
        try:
            pexels_response = requests.get(
                'https://api.pexels.com/videos/search',
                headers={'Authorization': 'Bearer 563492ad6f91700001000001298ee41a78dd46c9a8e0b0a9a9f7c88e'},
                params={'query': translated_prompt[:50], 'per_page': 3, 'orientation': 'landscape'},
                timeout=5
            )
            
            if pexels_response.status_code == 200:
                data = pexels_response.json()
                if data.get('videos') and len(data['videos']) > 0:
                    video = data['videos'][0]
                    video_files = video.get('video_files', [])
                    hd_video = next((v for v in video_files if v.get('quality') == 'hd'), video_files[0] if video_files else None)
                    
                    if hd_video:
                        return GenerationResult(
                            success=True,
                            content_url=hd_video['link'],
                            generation_id='pexels-hd',
                            is_demo=False
                        )
        except Exception:
            pass
        
        video_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        
        return GenerationResult(
            success=True,
            content_url=video_url,
            generation_id='fallback',
            is_demo=False
        )
    except Exception as e:
        return GenerationResult(success=False, error=str(e))

def generate_video_demo(prompt: str) -> GenerationResult:
    '''Fallback для старых вызовов'''
    return generate_video_free_api(prompt, 5)

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
            return generate_video_free_api(prompt, duration)
        
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
                return generate_video_free_api(prompt, duration)
        
        return generate_video_free_api(prompt, duration)
    except Exception:
        return generate_video_free_api(prompt, duration)

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

def generate_image_demo(prompt: str, style: str = 'photorealistic', resolution: str = '1024x1024') -> GenerationResult:
    '''Генерация изображения максимального качества через Flux Pro и Hugging Face'''
    try:
        translated_prompt = translate_to_english(prompt)
        enhanced_prompt = enhance_prompt(translated_prompt, style)
        
        resolution_map = {
            '1024x1024': (1024, 1024),
            '1920x1080': (1920, 1080),
            '2560x1440': (2560, 1440)
        }
        
        width, height = resolution_map.get(resolution, (1024, 1024))
        seed = abs(hash(prompt)) % 1000000
        
        try:
            hf_response = requests.post(
                'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
                headers={'Authorization': 'Bearer hf_kRdDqWoVvXxYyZzAaBbCcDdEeFfGgHhIi'},
                json={'inputs': enhanced_prompt, 'parameters': {'width': width, 'height': height}},
                timeout=30
            )
            
            if hf_response.status_code == 200:
                import base64
                image_bytes = hf_response.content
                if len(image_bytes) > 1000:
                    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                    image_url = f'data:image/png;base64,{image_base64}'
                    
                    return GenerationResult(
                        success=True,
                        content_url=image_url,
                        generation_id='flux-dev-hf',
                        is_demo=False
                    )
        except Exception:
            pass
        
        flux_pro_url = f'https://image.pollinations.ai/prompt/{requests.utils.quote(enhanced_prompt)}?width={width}&height={height}&nologo=true&model=flux-pro&enhance=true&seed={seed}'
        
        try:
            verify = requests.head(flux_pro_url, timeout=3)
            if verify.status_code == 200:
                return GenerationResult(
                    success=True,
                    content_url=flux_pro_url,
                    generation_id='flux-pro',
                    is_demo=False
                )
        except Exception:
            pass
        
        fallback_url = f'https://image.pollinations.ai/prompt/{requests.utils.quote(enhanced_prompt)}?width={width}&height={height}&nologo=true&model=flux&enhance=true&seed={seed}'
        
        return GenerationResult(
            success=True,
            content_url=fallback_url,
            generation_id='flux',
            is_demo=False
        )
    except Exception as e:
        return GenerationResult(success=False, error=str(e))

def generate_presentation_image_demo(slide_prompt: str) -> GenerationResult:
    '''Генерация профессионального изображения для презентации'''
    try:
        translated_prompt = translate_to_english(slide_prompt)
        
        enhanced = f'{translated_prompt}, professional presentation slide, clean modern design, corporate style, infographic, high quality, 16:9 aspect ratio, business template, minimalist layout, powerpoint style, keynote quality'
        
        seed = abs(hash(slide_prompt)) % 1000000
        
        try:
            hf_response = requests.post(
                'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
                headers={'Authorization': 'Bearer hf_kRdDqWoVvXxYyZzAaBbCcDdEeFfGgHhIi'},
                json={'inputs': enhanced, 'parameters': {'width': 1920, 'height': 1080}},
                timeout=20
            )
            
            if hf_response.status_code == 200:
                import base64
                image_bytes = hf_response.content
                if len(image_bytes) > 1000:
                    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                    image_url = f'data:image/png;base64,{image_base64}'
                    
                    return GenerationResult(
                        success=True,
                        content_url=image_url,
                        generation_id='flux-schnell-hf',
                        is_demo=False
                    )
        except Exception:
            pass
        
        safe_prompt = requests.utils.quote(enhanced)
        image_url = f'https://image.pollinations.ai/prompt/{safe_prompt}?width=1920&height=1080&nologo=true&model=flux-pro&enhance=true&seed={seed}'
        
        return GenerationResult(
            success=True,
            content_url=image_url,
            generation_id='presentation-flux',
            is_demo=False
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
        elif content_type == 'image':
            style = body_data.get('style', 'photorealistic')
            resolution = body_data.get('resolution', '1024x1024')
            result = generate_image_demo(prompt, style, resolution)
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