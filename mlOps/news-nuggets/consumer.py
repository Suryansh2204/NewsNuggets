import json
import uuid
import base64
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('NewsArticles') 
    
    for record in event['Records']:
        payload = json.loads(base64.b64decode(record['kinesis']['data']))
        
        # Optional: Ensure required fields are present
        item = {
            'article_id': str(uuid.uuid4()),
            "title": payload.get("title", ""),
            "description": payload.get("description", ""),
            "content": payload.get("content", ""),
            "publishedAt": payload.get("publishedAt", ""),
            "image_url": payload.get("image_url", ""),
            "source": payload.get("source", "")
        }
        table.put_item(Item=item)

    return {'statusCode': 200, 'body': 'Processed records successfully'}
