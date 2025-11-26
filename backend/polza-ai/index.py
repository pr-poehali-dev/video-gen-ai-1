'''
Business: Генерация текста, изображений и видео через Polza AI API
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с результатом генерации
'''

import os
import io
import json
import time
import base64
import requests
from typing import Dict, Any, Optional, Tuple

POLZA_API_KEY = os.environ.get("POLZA_AI_API_KEY")
BASE_URL = os.environ.get("POLZA_BASE_URL", "https://api.polza.ai/api/v1").rstrip("/")

TEXT_MODEL = "openai/gpt-4o"
IMAGE_MODEL = "kie/grok-imagine"
VIDEO_MODEL = "kling/kling2.5-text-to-video"

IMAGE_POLL_TIMEOUT_SEC = 300
IMAGE_POLL_INTERVAL_SEC = 2
VIDEO_POLL_TIMEOUT_SEC = 900
VIDEO_POLL_INTERVAL_SEC = 3


def _extract_request_id(data: Dict[str, Any]) -> Optional[str]:
    if not isinstance(data, dict):
        return None
    for key in ("requestId", "request_id", "id", "task_id"):
        val = data.get(key)
        if isinstance(val, str) and len(val) > 8 and "/" not in val:
            return val
    return None


def _parse_image_result(data: Dict[str, Any]) -> Optional[bytes]:
    if not isinstance(data, dict):
        return None
    
    print(f"DEBUG: Parsing response data: {json.dumps(data, indent=2)}")
    
    items_to_check = data.get("data", [])
    if not isinstance(items_to_check, list):
        items_to_check = [data]

    for item in items_to_check:
        if not isinstance(item, dict):
            continue
        
        for key in ("b64_json", "b64", "image_b64", "image"):
            if isinstance(item.get(key), str):
                try:
                    return base64.b64decode(item[key])
                except Exception as e:
                    print(f"DEBUG: Failed to decode base64 from key {key}: {e}")
        
        for key in ("url", "image_url", "output"):
            url = item.get(key)
            if isinstance(url, str) and url.startswith("http"):
                try:
                    response = requests.get(url, timeout=60)
                    response.raise_for_status()
                    return response.content
                except Exception as e:
                    print(f"DEBUG: Failed to download from {url}: {e}")
    
    print(f"DEBUG: No valid image data found in response")
    return None


def _poll_task(task_id: str, status_endpoint: str, timeout: int, interval: int) -> Tuple[Optional[bytes], Optional[str]]:
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}"}
    status_url = f"{BASE_URL}{status_endpoint}/{task_id}"
    start_time = time.time()
    
    print(f"DEBUG: Polling task {task_id} at {status_url}")

    while time.time() - start_time < timeout:
        r = requests.get(status_url, headers=headers, timeout=15)
        print(f"DEBUG: Poll response status: {r.status_code}")
        
        if r.status_code != 200:
            time.sleep(interval)
            continue
        
        data = r.json()
        status = str(data.get("status", "")).lower()
        print(f"DEBUG: Task status: {status}")

        if status in ("succeeded", "completed", "done"):
            result_bytes = _parse_image_result(data)
            if result_bytes:
                return result_bytes, None
            return None, f"Задача выполнена, но результат не найден в ответе. Полный ответ: {json.dumps(data)}"

        if status in ("failed", "error", "canceled"):
            error_info = data.get("error", {}).get("message", "Причина не указана.")
            return None, f"Задача провалена (статус: {status}): {error_info}"
        
        time.sleep(interval)

    return None, "Таймаут ожидания результата."


def generate_text(prompt: str, system_prompt: str = "") -> str:
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
    """Запускает генерацию изображения и возвращает task_id"""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": IMAGE_MODEL,
        "prompt": prompt,
        "size": size,
        "n": 1
    }
    
    print(f"DEBUG: Sending image generation request with prompt: {prompt}")

    response = requests.post(f"{BASE_URL}/images/generations", headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    
    response_data = response.json()
    print(f"DEBUG: Initial response: {json.dumps(response_data, indent=2)}")
    
    task_id = _extract_request_id(response_data)
    if not task_id:
        raise RuntimeError(f"Не удалось получить ID задачи от API. Ответ: {json.dumps(response_data)}")
    
    return task_id


def check_image_status(task_id: str) -> Dict[str, Any]:
    """Проверяет статус генерации изображения"""
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}"}
    status_url = f"{BASE_URL}/images/{task_id}"
    
    print(f"DEBUG: Checking status for task {task_id}")
    
    r = requests.get(status_url, headers=headers, timeout=15)
    if r.status_code != 200:
        return {"status": "error", "message": f"HTTP {r.status_code}"}
    
    data = r.json()
    status = str(data.get("status", "")).lower()
    print(f"DEBUG: Task status: {status}")
    
    if status in ("succeeded", "completed", "done"):
        result_bytes = _parse_image_result(data)
        if result_bytes:
            return {
                "status": "completed",
                "image_b64": base64.b64encode(result_bytes).decode('utf-8')
            }
        return {
            "status": "error",
            "message": f"Результат не найден. Ответ: {json.dumps(data)}"
        }
    
    if status in ("failed", "error", "canceled"):
        error_info = data.get("error", {}).get("message", "Причина не указана.")
        return {
            "status": "failed",
            "message": error_info
        }
    
    return {"status": "processing"}


def generate_image(prompt: str, size: str = "1024x1024") -> str:
    """DEPRECATED: Используется для обратной совместимости с тестами"""
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

    image_bytes, error = _poll_task(
        task_id=task_id,
        status_endpoint="/images",
        timeout=IMAGE_POLL_TIMEOUT_SEC,
        interval=IMAGE_POLL_INTERVAL_SEC
    )
    
    if error:
        raise RuntimeError(error)
    
    return base64.b64encode(image_bytes).decode('utf-8')


def generate_video(prompt: str) -> str:
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": VIDEO_MODEL,
        "prompt": prompt
    }

    response = requests.post(f"{BASE_URL}/videos/generations", headers=headers, json=payload, timeout=30)
    response.raise_for_status()
    
    task_id = _extract_request_id(response.json())
    if not task_id:
        raise RuntimeError("Не удалось получить ID задачи от API.")

    video_bytes, error = _poll_task(
        task_id=task_id,
        status_endpoint="/videos",
        timeout=VIDEO_POLL_TIMEOUT_SEC,
        interval=VIDEO_POLL_INTERVAL_SEC
    )
    
    if error:
        raise RuntimeError(error)
    
    return base64.b64encode(video_bytes).decode('utf-8')


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    print(f"DEBUG handler: method={method}, body={event.get('body', '')[:200]}")
    
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
        
        if not prompt and action != 'check_image':
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Prompt обязателен'}),
                'isBase64Encoded': False
            }
        
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
        
        elif action == 'image':
            size = body_data.get('size', '1024x1024')
            task_id = start_image_generation(prompt, size)
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'task_id': task_id,
                    'status': 'processing',
                    'message': 'Генерация начата. Используйте task_id для проверки статуса.'
                }),
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
                    'body': json.dumps({'error': 'task_id обязателен для проверки статуса'}),
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
        
        elif action == 'video':
            result = generate_video(prompt)
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'video_b64': result}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неизвестное действие. Доступно: text, image, check_image, video'}),
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