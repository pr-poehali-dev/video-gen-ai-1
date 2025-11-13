import json
import os
import urllib.request
import urllib.parse
import hashlib
import time
from typing import Dict, Any

spam_tracker: Dict[str, list] = {}

def clean_old_requests(ip: str, current_time: float) -> None:
    if ip in spam_tracker:
        spam_tracker[ip] = [t for t in spam_tracker[ip] if current_time - t < 60]

def is_rate_limited(ip: str) -> bool:
    current_time = time.time()
    clean_old_requests(ip, current_time)
    
    if ip not in spam_tracker:
        spam_tracker[ip] = []
    
    if len(spam_tracker[ip]) >= 3:
        return True
    
    spam_tracker[ip].append(current_time)
    return False

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправляет сообщения с контактной формы сайта в Telegram с защитой от спама
    Args: event с httpMethod, body (name, email, message, captcha, captchaAnswer)
          context с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    request_context = event.get('requestContext', {})
    identity = request_context.get('identity', {})
    source_ip = identity.get('sourceIp', 'unknown')
    
    if is_rate_limited(source_ip):
        return {
            'statusCode': 429,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Too many requests. Please try again later.'}),
            'isBase64Encoded': False
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Telegram credentials not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    name = body_data.get('name', '').strip()
    email = body_data.get('email', '').strip()
    message = body_data.get('message', '').strip()
    captcha_answer = body_data.get('captchaAnswer', '').strip()
    captcha_hash = body_data.get('captcha', '').strip()
    
    if not name or not email or not message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'All fields are required'}),
            'isBase64Encoded': False
        }
    
    if not captcha_answer or not captcha_hash:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Captcha is required'}),
            'isBase64Encoded': False
        }
    
    expected_hash = hashlib.sha256(captcha_answer.encode()).hexdigest()
    if expected_hash != captcha_hash:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid captcha'}),
            'isBase64Encoded': False
        }
    
    if len(name) > 100 or len(email) > 100 or len(message) > 2000:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Input too long'}),
            'isBase64Encoded': False
        }
    
    telegram_message = f"📨 Новое сообщение с сайта\n\n👤 Имя: {name}\n📧 Email: {email}\n\n💬 Сообщение:\n{message}"
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': telegram_message,
        'parse_mode': 'HTML'
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    try:
        with urllib.request.urlopen(req) as response:
            response.read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Message sent successfully'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Failed to send message: {str(e)}'}),
            'isBase64Encoded': False
        }
