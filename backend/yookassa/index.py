'''
Business: Обработка платежей через ЮКасса (создание платежа, проверка статуса)
Args: event с httpMethod (POST), body с action (create/check), amount, description, payment_id
Returns: JSON с payment_id и URL для оплаты или статусом платежа
'''

import json
import os
import uuid
import base64
from typing import Dict, Any
import requests

SHOP_ID = os.environ.get('YOOKASSA_SHOP_ID', '')
SECRET_KEY = os.environ.get('YOOKASSA_SECRET_KEY', '')
API_URL = 'https://api.yookassa.ru/v3'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
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
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if not SHOP_ID or not SECRET_KEY:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'error': 'ЮКасса не настроена. Добавьте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY'
            }),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'create':
            return create_payment(body, headers)
        elif action == 'check':
            return check_payment_status(body, headers)
        else:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Укажите action: create или check'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

def create_payment(body: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    try:
        amount = body.get('amount')
        description = body.get('description', 'Оплата на сайте')
        return_url = body.get('return_url', 'https://example.com/success')
        
        print(f'[PAYMENT] Creating payment: amount={amount}, description={description}')
        
        if not amount or float(amount) <= 0:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Укажите корректную сумму'}),
                'isBase64Encoded': False
            }
        
        idempotence_key = str(uuid.uuid4())
        
        payment_data = {
            'amount': {
                'value': str(amount),
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': return_url
            },
            'capture': True,
            'description': description
        }
        
        auth_string = f"{SHOP_ID}:{SECRET_KEY}"
        auth_bytes = auth_string.encode('utf-8')
        auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')
        
        response = requests.post(
            f'{API_URL}/payments',
            json=payment_data,
            headers={
                'Authorization': f'Basic {auth_b64}',
                'Idempotence-Key': idempotence_key,
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            payment_url = data.get('confirmation', {}).get('confirmation_url')
            print(f'[PAYMENT] Success! payment_id={data.get("id")}, payment_url={payment_url}')
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'payment_id': data.get('id'),
                    'payment_url': payment_url,
                    'status': data.get('status')
                }),
                'isBase64Encoded': False
            }
        
        print(f'[PAYMENT] Error from YooKassa: status={response.status_code}, body={response.text}')
        return {
            'statusCode': response.status_code,
            'headers': headers,
            'body': json.dumps({
                'error': 'Ошибка создания платежа',
                'details': response.text
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f'[PAYMENT] Exception in create_payment: {str(e)}')
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def check_payment_status(body: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
    try:
        payment_id = body.get('payment_id')
        
        if not payment_id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Укажите payment_id'}),
                'isBase64Encoded': False
            }
        
        auth_string = f"{SHOP_ID}:{SECRET_KEY}"
        auth_bytes = auth_string.encode('utf-8')
        auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')
        
        response = requests.get(
            f'{API_URL}/payments/{payment_id}',
            headers={
                'Authorization': f'Basic {auth_b64}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'payment_id': data.get('id'),
                    'status': data.get('status'),
                    'paid': data.get('paid'),
                    'amount': data.get('amount')
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': response.status_code,
            'headers': headers,
            'body': json.dumps({
                'error': 'Платеж не найден',
                'details': response.text
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }