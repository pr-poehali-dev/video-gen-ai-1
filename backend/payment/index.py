'''
Backend payment function for handling subscriptions via YooKassa
Supports SBP, bank cards, creates receipts, and manages auto-renewal
'''
import json
import os
import base64
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.error

PLANS = {
    'start': {'price': 0, 'name': 'Старт', 'duration_days': 30},
    'pro': {'price': 990, 'name': 'Про', 'duration_days': 30},
    'business': {'price': 2990, 'name': 'Бизнес', 'duration_days': 30}
}

COMPANY_INFO = {
    'name': 'ИП ЗВЕРЕВ АЛЕКСЕЙ СЕРГЕЕВИЧ',
    'inn': '616116993432',
    'phone': '+79282264638'
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'POST':
        if path == 'create':
            return create_payment(event)
        elif path == 'webhook':
            return handle_webhook(event)
        elif path == 'cancel':
            return cancel_subscription(event)
    
    return {
        'statusCode': 404,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Not found'})
    }

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def verify_token(token: str) -> Dict[str, Any]:
    import hashlib
    import hmac
    import time
    
    try:
        parts = token.split(':')
        if len(parts) != 4:
            return {}
        
        user_id, email, timestamp, signature = parts
        secret = os.environ.get('YOOKASSA_SECRET_KEY', 'default-secret')
        data = f"{user_id}:{email}:{timestamp}"
        expected_signature = hmac.new(secret.encode(), data.encode(), hashlib.sha256).hexdigest()
        
        if signature != expected_signature:
            return {}
        
        if int(time.time()) - int(timestamp) > 86400 * 30:
            return {}
        
        return {'user_id': int(user_id), 'email': email}
    except:
        return {}

def create_payment(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        token = event.get('headers', {}).get('X-User-Token', '')
        user_data = verify_token(token)
        
        if not user_data:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'})
            }
        
        body = json.loads(event.get('body', '{}'))
        plan_type = body.get('plan', 'pro')
        payment_method = body.get('payment_method', 'bank_card')
        auto_renew = body.get('auto_renew', True)
        
        if plan_type not in PLANS:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid plan'})
            }
        
        plan = PLANS[plan_type]
        
        if plan['price'] == 0:
            conn = get_db_connection()
            cur = conn.cursor()
            
            start_date = datetime.now()
            end_date = start_date + timedelta(days=plan['duration_days'])
            
            cur.execute("""
                INSERT INTO subscriptions (user_id, plan_type, status, start_date, end_date, auto_renew)
                VALUES (%s, %s, 'active', %s, %s, %s)
                RETURNING id
            """, (user_data['user_id'], plan_type, start_date, end_date, auto_renew))
            
            subscription_id = cur.fetchone()['id']
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'subscription_id': subscription_id,
                    'message': 'Free plan activated'
                })
            }
        
        shop_id = os.environ.get('YOOKASSA_SHOP_ID')
        secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
        
        if not shop_id or not secret_key:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Payment system not configured'})
            }
        
        import uuid
        idempotence_key = str(uuid.uuid4())
        
        payment_data = {
            'amount': {
                'value': f"{plan['price']:.2f}",
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': body.get('return_url', 'https://your-site.com/payment/success')
            },
            'capture': True,
            'description': f"Подписка {plan['name']} на ROUSHEN",
            'metadata': {
                'user_id': user_data['user_id'],
                'plan_type': plan_type,
                'auto_renew': auto_renew
            },
            'receipt': {
                'customer': {
                    'email': user_data['email']
                },
                'items': [{
                    'description': f"Подписка {plan['name']}",
                    'quantity': '1',
                    'amount': {
                        'value': f"{plan['price']:.2f}",
                        'currency': 'RUB'
                    },
                    'vat_code': 1
                }]
            }
        }
        
        if payment_method == 'sbp':
            payment_data['payment_method_data'] = {'type': 'sbp'}
        
        auth_string = f"{shop_id}:{secret_key}"
        auth_header = 'Basic ' + base64.b64encode(auth_string.encode()).decode()
        
        request = urllib.request.Request(
            'https://api.yookassa.ru/v3/payments',
            data=json.dumps(payment_data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': auth_header,
                'Idempotence-Key': idempotence_key
            },
            method='POST'
        )
        
        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode('utf-8'))
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO payments (user_id, amount, currency, payment_method, yookassa_payment_id, status)
            VALUES (%s, %s, 'RUB', %s, %s, 'pending')
            RETURNING id
        """, (user_data['user_id'], plan['price'], payment_method, result['id']))
        
        payment_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'payment_id': payment_id,
                'confirmation_url': result['confirmation']['confirmation_url'],
                'yookassa_payment_id': result['id']
            })
        }
        
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'YooKassa error: {error_body}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

def handle_webhook(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        body = json.loads(event.get('body', '{}'))
        
        if body.get('event') != 'payment.succeeded':
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': ''
            }
        
        payment_object = body.get('object', {})
        yookassa_payment_id = payment_object.get('id')
        metadata = payment_object.get('metadata', {})
        
        user_id = int(metadata.get('user_id'))
        plan_type = metadata.get('plan_type')
        auto_renew = metadata.get('auto_renew', 'true') == 'true'
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            UPDATE payments 
            SET status = 'succeeded', receipt_url = %s, updated_at = CURRENT_TIMESTAMP
            WHERE yookassa_payment_id = %s
            RETURNING id
        """, (payment_object.get('receipt_registration'), yookassa_payment_id))
        
        payment_record = cur.fetchone()
        
        if payment_record:
            plan = PLANS.get(plan_type, PLANS['pro'])
            start_date = datetime.now()
            end_date = start_date + timedelta(days=plan['duration_days'])
            
            cur.execute("""
                INSERT INTO subscriptions (user_id, plan_type, status, start_date, end_date, auto_renew)
                VALUES (%s, %s, 'active', %s, %s, %s)
                RETURNING id
            """, (user_id, plan_type, start_date, end_date, auto_renew))
            
            subscription_id = cur.fetchone()['id']
            
            cur.execute("""
                UPDATE payments SET subscription_id = %s WHERE id = %s
            """, (subscription_id, payment_record['id']))
            
            conn.commit()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': ''
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def cancel_subscription(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        token = event.get('headers', {}).get('X-User-Token', '')
        user_data = verify_token(token)
        
        if not user_data:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Unauthorized'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            UPDATE subscriptions 
            SET auto_renew = false, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = %s AND status = 'active'
            RETURNING id
        """, (user_data['user_id'],))
        
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        if not result:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'No active subscription found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'success': True, 'message': 'Auto-renewal cancelled'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
