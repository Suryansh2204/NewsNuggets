import boto3
import uuid
import hashlib
import os
import json
import base64

import secrets  # For cryptographically secure salt generation

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['USERS_TABLE'])

def hash_password(password, salt):
    # Combine and hash with SHA256
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def lambda_handler(event, context):
    body = json.loads(event['body'])

    name = body.get('name')
    email = body.get('email')
    password = body.get('password')

    if not name or not email or not password:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Missing fields'})
        }

    user_id = str(uuid.uuid4())
    salt = base64.b64encode(secrets.token_bytes(16)).decode('utf-8')
    hashed_password = hash_password(password, salt)

    table.put_item(Item={
        'id': user_id,
        'email': email,
        'name': name,
        'salt': salt,
        'password': hashed_password
    })

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'User registered successfully', 'id': user_id})
    }
