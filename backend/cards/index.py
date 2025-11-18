'''
Business: Manage user payment cards (add, list, remove)
Args: event with httpMethod, body (user_id, card details)
Returns: HTTP response with card data
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
            user_id = str(body_data.get('user_id', ''))
            card_number = body_data.get('card_number', '')
            card_holder = body_data.get('card_holder', '')
            
            if not user_id or len(card_number) != 4 or not card_holder:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid card data. Need last 4 digits and cardholder name'})
                }
            
            cur.execute("SELECT id FROM users WHERE id = %s", (int(user_id),))
            if not cur.fetchone():
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            cur.execute("SELECT COUNT(*) FROM cards WHERE user_id = %s", (user_id,))
            card_count = cur.fetchone()[0]
            is_primary = card_count == 0
            
            cur.execute(
                "INSERT INTO cards (user_id, card_number, card_holder, is_primary) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                (user_id, card_number, card_holder, is_primary)
            )
            new_card = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'card': {
                        'id': new_card[0],
                        'card_number': card_number,
                        'card_holder': card_holder,
                        'is_primary': is_primary,
                        'created_at': new_card[1].isoformat()
                    }
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
                "SELECT id, card_number, card_holder, is_primary, created_at FROM cards WHERE user_id = %s ORDER BY is_primary DESC, created_at DESC",
                (user_id,)
            )
            cards = cur.fetchall()
            
            cards_list = [{
                'id': c[0],
                'card_number': c[1],
                'card_holder': c[2],
                'is_primary': c[3],
                'created_at': c[4].isoformat()
            } for c in cards]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'cards': cards_list})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()