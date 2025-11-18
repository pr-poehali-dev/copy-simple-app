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
            
            avatar = body_data.get('avatar')
            
            cur.execute("SELECT id, phone, balance, total_spent, first_purchase_date, is_unlocked, avatar, withdrawal_window_start, withdrawal_window_end FROM users WHERE phone = %s", (phone,))
            user = cur.fetchone()
            
            if user:
                user_data = {
                    'id': user[0],
                    'phone': user[1],
                    'balance': float(user[2]) if user[2] else 0,
                    'total_spent': float(user[3]) if user[3] else 0,
                    'first_purchase_date': user[4].isoformat() if user[4] else None,
                    'is_unlocked': user[5],
                    'avatar': user[6] or 'boy',
                    'withdrawal_window_start': user[7].isoformat() if user[7] else None,
                    'withdrawal_window_end': user[8].isoformat() if user[8] else None,
                    'needs_avatar': False
                }
            else:
                if avatar:
                    cur.execute("INSERT INTO users (phone, avatar) VALUES (%s, %s) RETURNING id, phone, balance, total_spent, first_purchase_date, is_unlocked, avatar, withdrawal_window_start, withdrawal_window_end", (phone, avatar))
                    new_user = cur.fetchone()
                    conn.commit()
                    user_data = {
                        'id': new_user[0],
                        'phone': new_user[1],
                        'balance': float(new_user[2]) if new_user[2] else 0,
                        'total_spent': float(new_user[3]) if new_user[3] else 0,
                        'first_purchase_date': new_user[4].isoformat() if new_user[4] else None,
                        'is_unlocked': new_user[5],
                        'avatar': new_user[6] or 'boy',
                        'withdrawal_window_start': new_user[7].isoformat() if new_user[7] else None,
                        'withdrawal_window_end': new_user[8].isoformat() if new_user[8] else None,
                        'needs_avatar': False
                    }
                else:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'needs_avatar': True, 'phone': phone})
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