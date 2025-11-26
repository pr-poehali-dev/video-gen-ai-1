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
    
    items_to_check = data.get("data", [])
    if not isinstance(items_to_check, list):
        items_to_check = [data]

    for item in items_to_check:
        if not isinstance(item, dict):
            continue
        
        for key in ("b64_json", "b64", "image_b64"):
            if isinstance(item.get(key), str):
                return base64.b64decode(item[key])
        
        for key in ("url", "image_url"):
            if isinstance(item.get(key), str) and item[key].startswith("http"):
                response = requests.get(item[key], timeout=60)
                response.raise_for_status()
                return response.content
    return None


def _poll_task(task_id: str, status_endpoint: str, timeout: int, interval: int) -> Tuple[Optional[bytes], Optional[str]]:
    headers = {"Authorization": f"Bearer {POLZA_API_KEY}"}
    status_url = f"{BASE_URL}{status_endpoint}/{task_id}"
    start_time = time.time()

    while time.time() - start_time < timeout:
        r = requests.get(status_url, headers=headers, timeout=15)
        if r.status_code != 200:
            time.sleep(interval)
            continue
        
        data = r.json()
        status = str(data.get("status", "")).lower()

        if status in ("succeeded", "completed", "done"):
            result_bytes = _parse_image_result(data)
            if result_bytes:
                return result_bytes, None
            return None, "Задача выполнена, но результат не найден в ответе."

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


def generate_image(prompt: str, size: str = "1024x1024") -> str:
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
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if not POLZA_API_KEY:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'POLZA_AI_API_KEY не настроен'})
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        prompt = body_data.get('prompt', '')
        
        if not prompt:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Prompt обязателен'})
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
                'body': json.dumps({'text': result})
            }
        
        elif action == 'image':
            size = body_data.get('size', '1024x1024')
            result = generate_image(prompt, size)
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'image_b64': result})
            }
        
        elif action == 'video':
            result = generate_video(prompt)
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'video_b64': result})
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неизвестное действие. Доступно: text, image, video'})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
