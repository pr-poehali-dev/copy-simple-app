'''
Business: Handle user purchases with 80% cashback to virtual balance
Args: event with httpMethod, body (user_id, category, price, emoji)
Returns: HTTP response with updated balance and purchase data
'''

import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any

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
            category = body_data.get('category')
            price = float(body_data.get('price', 0))
            emoji = body_data.get('emoji', '')
            
            if not user_id or not category or price <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid purchase data'})
                }
            
            cashback = price * 0.80
            
            cur.execute("SELECT first_purchase_date FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            first_purchase_date = user[0]
            if not first_purchase_date:
                cur.execute("UPDATE users SET first_purchase_date = %s WHERE id = %s", (datetime.now(), user_id))
            
            cur.execute(
                "UPDATE users SET balance = balance + %s, total_spent = total_spent + %s WHERE id = %s",
                (cashback, price, user_id)
            )
            
            cur.execute(
                "INSERT INTO purchases (user_id, category, price, cashback, emoji) VALUES (%s, %s, %s, %s, %s) RETURNING id, created_at",
                (user_id, category, price, cashback, emoji)
            )
            purchase = cur.fetchone()
            conn.commit()
            
            cur.execute("SELECT balance, total_spent FROM users WHERE id = %s", (user_id,))
            updated_user = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'purchase': {
                        'id': purchase[0],
                        'category': category,
                        'price': price,
                        'cashback': cashback,
                        'emoji': emoji,
                        'created_at': purchase[1].isoformat()
                    },
                    'balance': float(updated_user[0]),
                    'total_spent': float(updated_user[1])
                })
            }
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {})
            user_id = query_params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id is required'})
                }
            
            cur.execute(
                "SELECT id, category, price, cashback, emoji, created_at FROM purchases WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            purchases = cur.fetchall()
            
            purchases_list = [{
                'id': p[0],
                'category': p[1],
                'price': float(p[2]),
                'cashback': float(p[3]),
                'emoji': p[4],
                'created_at': p[5].isoformat()
            } for p in purchases]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'purchases': purchases_list})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
