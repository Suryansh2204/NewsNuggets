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


# import json
# import uuid
# import base64
# import boto3

# def lambda_handler(event, context):
#     dynamodb = boto3.resource('dynamodb')
#     table = dynamodb.Table('NewsArticles') 
    
#     for record in event['Records']:
#         payload = json.loads(base64.b64decode(record['kinesis']['data']))
#         res= summarize_categorize(payload["title"], payload["description"], payload.get("content", ""))
#         if(res["statusCode"] == 200):
#             payload["summary"] = res["summary"]
#             payload["category"] = res["category"]
#         # Optional: Ensure required fields are present
#         item = {
#             'article_id': str(uuid.uuid4()),
#             "title": payload.get("title", ""),
#             "description": payload.get("description", ""),
#             "content": payload.get("content", ""),
#             "publishedAt": payload.get("publishedAt", ""),
#             "image_url": payload.get("image_url", ""),
#             "source": payload.get("source", ""),
            
#         }
#         table.put_item(Item=item)

#     return {'statusCode': 200, 'body': 'Processed records successfully'}

# def summarize_categorize(title,description,content):
#     openAIKey = get_secret("OPEN_AI_KEY")
#     url = "https://api.openai.com/v1/chat/completions"
    
#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer {openAIKey}"
#     }

#     payload = {
#         "model": "gpt-4o",
#         "messages": [
#             {
#                 "role": "system",
#                 "content": "You are a professional news analyst that provides a summary of a news article and a one word describing the category to which the news belongs to. The format should be as follows:| Summary: lorem ipsum | Category: lorem"
#             },
#             {
#                 "role": "user",
#                 "content": f"{title} - {description} - {content}"
#             }
#         ],
#         "max_tokens": 500,
#         "temperature": 0.7
#     }

#     try:
#         response = requests.post(url, headers=headers, json=payload)
#         response.raise_for_status()
#         result = response.json()
#         required = result['choices'][0]['message']['content'].split('|')
#         summary = required[1].split(':')[1].strip()
#         category = required[2].split(':')[1].strip()
#         return {
#             "statusCode": 200,
#             "summary": summary,
#             "category": category
#         }
#     except requests.exceptions.RequestException as e:
#         return {
#             "statusCode": 500,
#             "body": json.dumps({"error": str(e)})
#         }

# def get_secret(keyName):
#     secret_name = "apikeys"
#     region_name = "us-east-1"

#     session = boto3.session.Session()
#     client = session.client(
#         service_name='secretsmanager',
#         region_name=region_name
#     )

#     try:
#         get_secret_value_response = client.get_secret_value(
#             SecretId=secret_name
#         )
#     except ClientError as e:
#         raise e

#     secret = json.loads(get_secret_value_response['SecretString'])
#     return secret[keyName]