'''
Business: Генерация текста, изображений и видео через Polza AI API
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с результатом генерации
'''

import os
import json
import base64
import requests
from typing import Optional, Dict, Any

POLZA_API_KEY = os.environ.get("POLZA_AI_API_KEY")
BASE_URL = os.environ.get("POLZA_BASE_URL", "https://api.polza.ai/api/v1").rstrip("/")

TEXT_MODEL = "openai/gpt-4o"
IMAGE_MODEL = "kie/grok-imagine"
VIDEO_MODEL = "kling/kling2.5-text-to-video"


def _extract_request_id(data: Dict[str, Any]) -> Optional[str]:
    """Извлекает ID задачи из ответа API."""
    if not isinstance(data, dict):
        return None
    for key in ("requestId", "request_id", "id", "task_id"):
        val = data.get(key)
        if isinstance(val, str) and len(val) > 8 and "/" not in val:
            return val
    return None


def generate_text(prompt: str, system_prompt: str = "") -> str:
    """Генерирует текст с помощью заданной модели."""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}", "Content-Type": "application/json"}
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": TEXT_MODEL,
        "messages": messages,
        "stream": False
    }
    
    response = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload, timeout=180)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def start_image_generation(prompt: str, size: str = "1024x1024") -> str:
    """Запускает генерацию изображения и возвращает task_id."""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": IMAGE_MODEL,
        "prompt": prompt,
        "size": size,
        "n": 1
    }

    response = requests.post(f"{BASE_URL}/images/generations", headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    
    task_id = _extract_request_id(response.json())
    if not task_id:
        raise RuntimeError("Не удалось получить ID задачи от API.")
    
    return task_id


def check_image_status(task_id: str) -> Dict[str, Any]:
    """Проверяет статус генерации изображения."""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}"}
    status_url = f"{BASE_URL}/images/{task_id}"
    
    r = requests.get(status_url, headers=headers, timeout=15)
    if r.status_code != 200:
        return {"status": "error", "message": f"HTTP {r.status_code}"}
    
    data = r.json()
    status = str(data.get("status", "")).lower()
    
    if status in ("succeeded", "completed", "done"):
        # Ищем изображение в data
        items_to_check = data.get("data", [])
        if not isinstance(items_to_check, list):
            items_to_check = [data]
        
        for item in items_to_check:
            if not isinstance(item, dict):
                continue
            # Проверяем b64
            for key in ("b64_json", "b64", "image_b64"):
                if isinstance(item.get(key), str):
                    return {"status": "completed", "image_b64": item[key]}
            # Проверяем URL
            for key in ("url", "image_url"):
                url = item.get(key)
                if isinstance(url, str) and url.startswith("http"):
                    try:
                        img_response = requests.get(url, timeout=60)
                        img_response.raise_for_status()
                        img_b64 = base64.b64encode(img_response.content).decode('utf-8')
                        return {"status": "completed", "image_b64": img_b64}
                    except Exception as e:
                        return {"status": "error", "message": f"Ошибка скачивания: {str(e)}"}
        
        return {"status": "error", "message": "Результат не найден в ответе"}
    
    if status in ("failed", "error", "canceled"):
        error_info = data.get("error", {}).get("message", "Причина не указана.")
        return {"status": "failed", "message": error_info}
    
    return {"status": "processing"}


def start_video_generation(prompt: str) -> str:
    """Запускает генерацию видео и возвращает task_id."""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": VIDEO_MODEL,
        "prompt": prompt,
        "mode": "standard",
        "duration": 5,
        "aspect_ratio": "16:9"
    }

    print(f"DEBUG: Starting video generation with prompt: {prompt}")
    response = requests.post(f"{BASE_URL}/videos/generations", headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    
    response_data = response.json()
    print(f"DEBUG: Video generation response: {json.dumps(response_data, indent=2)}")
    
    task_id = _extract_request_id(response_data)
    if not task_id:
        raise RuntimeError(f"Не удалось получить ID задачи от API. Ответ: {json.dumps(response_data)}")
    
    print(f"DEBUG: Video task_id: {task_id}")
    return task_id


def check_video_status(task_id: str) -> Dict[str, Any]:
    """Проверяет статус генерации видео."""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}"}
    status_url = f"{BASE_URL}/videos/{task_id}"
    
    print(f"DEBUG: Checking video status at {status_url}")
    r = requests.get(status_url, headers=headers, timeout=15)
    print(f"DEBUG: Status check response code: {r.status_code}")
    
    if r.status_code != 200:
        return {"status": "error", "message": f"HTTP {r.status_code}"}
    
    data = r.json()
    status = str(data.get("status", "")).lower()
    print(f"DEBUG: Video task status: {status}, response: {json.dumps(data, indent=2)[:500]}")
    
    if status in ("succeeded", "completed", "done"):
        # Ищем URL видео напрямую
        video_url = data.get("url")
        if video_url and isinstance(video_url, str) and video_url.startswith("http"):
            print(f"DEBUG: Video ready at URL: {video_url}")
            return {"status": "completed", "video_url": video_url}
        
        print(f"DEBUG: Status is completed but no video URL found")
        return {"status": "error", "message": f"Результат не найден. Ответ: {json.dumps(data)}"}
    
    if status in ("failed", "error", "canceled"):
        error_info = data.get("error", {}).get("message", "Причина не указана.")
        print(f"DEBUG: Video generation failed: {error_info}")
        return {"status": "failed", "message": error_info}
    
    print(f"DEBUG: Video still processing...")
    return {"status": "processing"}


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    print(f"[POLZA-AI] method={method}, body={event.get('body', '')[:200]}")
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if not POLZA_API_KEY:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'POLZA_AI_API_KEY не настроен'}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        prompt = body_data.get('prompt', '')
        
        if not prompt and action not in ('check_image', 'check_video'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Prompt обязателен'}),
                'isBase64Encoded': False
            }
        
        try:
            if action == 'text':
                system_prompt = body_data.get('system_prompt', '')
                result = generate_text(prompt, system_prompt)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'text': result}),
                    'isBase64Encoded': False
                }
            
            elif action == 'start_image':
                size = body_data.get('size', '1024x1024')
                task_id = start_image_generation(prompt, size)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'task_id': task_id, 'status': 'processing'}),
                    'isBase64Encoded': False
                }
            
            elif action == 'check_image':
                task_id = body_data.get('task_id')
                if not task_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'task_id обязателен'}),
                        'isBase64Encoded': False
                    }
                result = check_image_status(task_id)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            
            elif action == 'start_video':
                task_id = start_video_generation(prompt)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'task_id': task_id, 'status': 'processing'}),
                    'isBase64Encoded': False
                }
            
            elif action == 'check_video':
                task_id = body_data.get('task_id')
                if not task_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'task_id обязателен'}),
                        'isBase64Encoded': False
                    }
                result = check_video_status(task_id)
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Неизвестное действие. Доступно: text, start_image, check_image, start_video, check_video'}),
                    'isBase64Encoded': False
                }
        
        except Exception as e:
            print(f"Ошибка генерации: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Метод не поддерживается'}),
        'isBase64Encoded': False
    }
