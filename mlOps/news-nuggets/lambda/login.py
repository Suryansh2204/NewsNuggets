import boto3
import hashlib
import os
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['USERS_TABLE'])

def hash_password(password, salt):
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing email or password'})
            }

        # Query DynamoDB by email using scan (you can optimize this if email is indexed)
        response = table.scan(
            FilterExpression="email = :e",
            ExpressionAttributeValues={":e": email}
        )

        if not response['Items']:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Invalid credentials'})
            }

        user = response['Items'][0]
        salt = user['salt']
        stored_hash = user['password']

        # Recompute hash and compare
        input_hash = hash_password(password, salt)
        if input_hash == stored_hash:
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Login successful',
                    'user_id': user['id'],
                    'name': user['name']
                })
            }
        else:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Invalid credentials'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error', 'error': str(e)})
        }
