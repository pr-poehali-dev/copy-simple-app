'''
Business: User authentication and registration by phone number
Args: event with httpMethod, body (phone number for login/register)
Returns: HTTP response with user data or error
'''

import json
import os
import psycopg2
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
            phone = body_data.get('phone', '').strip()
            
            if not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Phone number is required'})
                }
            
            cur.execute("SELECT id, phone, balance, total_spent, first_purchase_date, is_unlocked FROM users WHERE phone = %s", (phone,))
            user = cur.fetchone()
            
            if user:
                user_data = {
                    'id': user[0],
                    'phone': user[1],
                    'balance': float(user[2]) if user[2] else 0,
                    'total_spent': float(user[3]) if user[3] else 0,
                    'first_purchase_date': user[4].isoformat() if user[4] else None,
                    'is_unlocked': user[5]
                }
            else:
                cur.execute("INSERT INTO users (phone) VALUES (%s) RETURNING id, phone, balance, total_spent, first_purchase_date, is_unlocked", (phone,))
                new_user = cur.fetchone()
                conn.commit()
                user_data = {
                    'id': new_user[0],
                    'phone': new_user[1],
                    'balance': float(new_user[2]) if new_user[2] else 0,
                    'total_spent': float(new_user[3]) if new_user[3] else 0,
                    'first_purchase_date': new_user[4].isoformat() if new_user[4] else None,
                    'is_unlocked': new_user[5]
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'user': user_data})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
