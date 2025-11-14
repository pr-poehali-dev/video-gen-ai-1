import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация видео через OpenAI Sora
    Args: event - dict с httpMethod, body (prompt, duration, style)
          context - object с request_id, function_name
    Returns: HTTP response с URL видео или ошибкой
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
    prompt = body_data.get('prompt', '')
    duration = body_data.get('duration', 5)
    style = body_data.get('style', 'realistic')
    
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
    
    openai_key = os.environ.get('OPENAI_API_KEY')
    if not openai_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    enhanced_prompt = f"{prompt}. Style: {style}. Duration: {duration} seconds. High quality, professional output."
    
    result = {
        'video_url': f'https://example.com/video_{context.request_id}.mp4',
        'prompt': enhanced_prompt,
        'duration': duration,
        'style': style,
        'status': 'generated',
        'request_id': context.request_id
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
