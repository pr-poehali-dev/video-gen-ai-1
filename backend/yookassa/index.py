'''
Business: Обработка платежей через ЮКасса (создание платежа, проверка статуса)
Args: event с httpMethod (POST), body с action (create/check), amount, description, payment_id
Returns: JSON с payment_id и URL для оплаты или статусом платежа
'''

import json
import os
import uuid
from typing import Dict, Any
from yookassa import Configuration, Payment

SHOP_ID = os.environ.get('YOOKASSA_SHOP_ID', '')
SECRET_KEY = os.environ.get('YOOKASSA_SECRET_KEY', '')

Configuration.account_id = SHOP_ID
Configuration.secret_key = SECRET_KEY

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
        
        payment = Payment.create({
            "amount": {
                "value": f"{float(amount):.2f}",
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": return_url
            },
            "capture": True,
            "description": description
        }, idempotence_key)
        
        print(f'[PAYMENT] Payment created: id={payment.id}, status={payment.status}')
        print(f'[PAYMENT] Confirmation URL: {payment.confirmation.confirmation_url}')
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'payment_id': payment.id,
                'payment_url': payment.confirmation.confirmation_url,
                'status': payment.status
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
        
        payment = Payment.find_one(payment_id)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'payment_id': payment.id,
                'status': payment.status,
                'paid': payment.paid,
                'amount': {
                    'value': payment.amount.value,
                    'currency': payment.amount.currency
                }
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