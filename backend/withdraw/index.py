'''
Business: Process withdrawal requests via YooKassa payment system
Args: event with httpMethod, body (user_id, amount, card_id)
Returns: HTTP response with payment URL or withdrawal status
'''

import json
import os
import psycopg2
import requests
import base64
from typing import Dict, Any
from decimal import Decimal

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
            'body': ''
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            amount = body_data.get('amount')
            card_id = body_data.get('card_id')
            
            if not user_id or not amount or not card_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id, amount and card_id required'})
                }
            
            cur.execute("""
                SELECT balance, is_unlocked, first_purchase_date 
                FROM users 
                WHERE id = %s
            """, (user_id,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            balance = float(user[0]) if user[0] else 0
            is_unlocked = user[1]
            
            if not is_unlocked:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Withdrawal not available yet. Wait 180 days from first purchase'})
                }
            
            if balance < float(amount):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient balance'})
                }
            
            cur.execute("SELECT card_number FROM cards WHERE id = %s AND user_id = %s", (card_id, user_id))
            card = cur.fetchone()
            
            if not card:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Card not found'})
                }
            
            shop_id = os.environ.get('YUKASSA_SHOP_ID')
            secret_key = os.environ.get('YUKASSA_SECRET_KEY')
            
            if not shop_id or not secret_key:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Payment system not configured'})
                }
            
            idempotence_key = f"{user_id}-{card_id}-{context.request_id}"
            
            auth_string = f"{shop_id}:{secret_key}"
            auth_bytes = auth_string.encode('utf-8')
            auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')
            
            yukassa_payload = {
                "amount": {
                    "value": f"{float(amount):.2f}",
                    "currency": "RUB"
                },
                "payment_method_data": {
                    "type": "bank_card"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": "https://yourapp.com/success"
                },
                "capture": True,
                "description": f"Withdrawal for user {user_id}"
            }
            
            yukassa_response = requests.post(
                'https://api.yookassa.ru/v3/payments',
                json=yukassa_payload,
                headers={
                    'Authorization': f'Basic {auth_b64}',
                    'Idempotence-Key': idempotence_key,
                    'Content-Type': 'application/json'
                }
            )
            
            if yukassa_response.status_code not in [200, 201]:
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Payment creation failed', 'details': yukassa_response.text})
                }
            
            payment_data = yukassa_response.json()
            payment_id = payment_data.get('id')
            confirmation_url = payment_data.get('confirmation', {}).get('confirmation_url')
            
            cur.execute("""
                INSERT INTO withdrawals (user_id, amount, card_id, status, yukassa_payment_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (user_id, amount, card_id, 'pending', payment_id))
            
            withdrawal_id = cur.fetchone()[0]
            
            cur.execute("""
                UPDATE users 
                SET balance = balance - %s
                WHERE id = %s
            """, (amount, user_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'withdrawal_id': withdrawal_id,
                    'payment_url': confirmation_url,
                    'status': 'pending'
                })
            }
        
        if method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id required'})
                }
            
            cur.execute("""
                SELECT id, amount, status, created_at, completed_at
                FROM withdrawals
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user_id,))
            
            withdrawals = []
            for row in cur.fetchall():
                withdrawals.append({
                    'id': row[0],
                    'amount': float(row[1]) if row[1] else 0,
                    'status': row[2],
                    'created_at': row[3].isoformat() if row[3] else None,
                    'completed_at': row[4].isoformat() if row[4] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'withdrawals': withdrawals})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
