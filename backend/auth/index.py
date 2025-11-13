'''
Backend auth function for user registration, login, and profile management
Handles user authentication with JWT tokens
'''
import json
import os
import hashlib
import hmac
import time
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'POST':
        if path == 'register':
            return handle_register(event)
        elif path == 'login':
            return handle_login(event)
    elif method == 'GET':
        if path == 'profile':
            return handle_profile(event)
    
    return {
        'statusCode': 404,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Not found'})
    }

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: int, email: str) -> str:
    secret = os.environ.get('YOOKASSA_SECRET_KEY', 'default-secret')
    timestamp = str(int(time.time()))
    data = f"{user_id}:{email}:{timestamp}"
    signature = hmac.new(secret.encode(), data.encode(), hashlib.sha256).hexdigest()
    return f"{user_id}:{email}:{timestamp}:{signature}"

def verify_token(token: str) -> Dict[str, Any]:
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

def handle_register(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        name = body.get('name', '').strip()
        
        if not email or not password or len(password) < 6:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid email or password (min 6 chars)'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Email already registered'})
            }
        
        password_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
            (email, password_hash, name)
        )
        user_id = cur.fetchone()['id']
        conn.commit()
        
        token = create_token(user_id, email)
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': {'id': user_id, 'email': email, 'name': name}
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

def handle_login(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        
        if not email or not password:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Email and password required'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        password_hash = hash_password(password)
        cur.execute(
            "SELECT id, email, name FROM users WHERE email = %s AND password_hash = %s",
            (email, password_hash)
        )
        user = cur.fetchone()
        
        if not user:
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid email or password'})
            }
        
        cur.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s", (user['id'],))
        conn.commit()
        
        token = create_token(user['id'], user['email'])
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': {'id': user['id'], 'email': user['email'], 'name': user['name']}
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

def handle_profile(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        token = event.get('headers', {}).get('X-User-Token', '')
        user_data = verify_token(token)
        
        if not user_data:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid token'})
            }
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT u.id, u.email, u.name, u.created_at,
                   s.plan_type, s.status, s.end_date, s.auto_renew
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
            WHERE u.id = %s
        """, (user_data['user_id'],))
        
        profile = cur.fetchone()
        cur.close()
        conn.close()
        
        if not profile:
            return {
                'statusCode': 404,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'User not found'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({
                'user': {
                    'id': profile['id'],
                    'email': profile['email'],
                    'name': profile['name'],
                    'created_at': profile['created_at'].isoformat() if profile['created_at'] else None
                },
                'subscription': {
                    'plan': profile.get('plan_type'),
                    'status': profile.get('status'),
                    'end_date': profile['end_date'].isoformat() if profile.get('end_date') else None,
                    'auto_renew': profile.get('auto_renew')
                } if profile.get('plan_type') else None
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
