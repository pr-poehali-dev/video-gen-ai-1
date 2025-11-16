'''
Генерация текста через OpenRouter (универсальный доступ к GPT-4, Claude, Gemini)
'''
import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация текста через OpenRouter
    Args: event с httpMethod, body (prompt, max_tokens, temperature, model)
    Returns: Сгенерированный текст
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        api_key = os.environ.get('OPENROUTER_API_KEY')
        
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'OPENROUTER_API_KEY не настроен',
                    'message': 'Добавьте ключ OpenRouter в секреты проекта'
                })
            }
        
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        body_data = json.loads(body_str)
        prompt = body_data.get('prompt', '')
        max_tokens = body_data.get('max_tokens', 2000)
        temperature = body_data.get('temperature', 0.7)
        model = body_data.get('model', 'openai/gpt-3.5-turbo')
        
        if not prompt:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Параметр prompt обязателен'})
            }
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://poehali.dev',
            'X-Title': 'Poehali AI Generator'
        }
        
        payload = {
            'model': model,
            'messages': [
                {'role': 'user', 'content': prompt}
            ],
            'max_tokens': max_tokens,
            'temperature': temperature
        }
        
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            json=payload,
            headers=headers,
            timeout=60
        )
        
        if response.status_code != 200:
            error_data = response.json() if response.text else {}
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'error': 'Ошибка OpenRouter API',
                    'details': error_data.get('error', {}).get('message', str(error_data)),
                    'status': response.status_code
                })
            }
        
        result = response.json()
        text_content = result['choices'][0]['message']['content']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'text': text_content,
                'model': result.get('model', model),
                'usage': result.get('usage', {}),
                'id': result.get('id', '')
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }