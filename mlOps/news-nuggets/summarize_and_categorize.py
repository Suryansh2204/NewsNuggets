import json
import boto3
from botocore.exceptions import ClientError
import requests

def lambda_handler(event, context):
    openAIKey = get_secret("OPEN_AI_KEY")
    url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openAIKey}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "system",
                "content": "You are a professional news analyst that provides a summary of a news article and a one word describing the category to which the news belongs to. The format should be as follows:| Summary: lorem ipsum | Category: lorem"
            },
            {
                "role": "user",
                "content": f"{event['title']} - {event['description']}"
            }
        ],
        "max_tokens": 500,
        "temperature": 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        required = result['choices'][0]['message']['content'].split('|')
        summary = required[1].split(':')[1].strip()
        category = required[2].split(':')[1].strip()
        return {
            "statusCode": 200,
            "summary": summary,
            "category": category
        }
    except requests.exceptions.RequestException as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def get_secret(keyName):
    client = boto3.client('lambda')
    response = client.invoke(
        FunctionName='get_secrets',
        InvocationType='RequestResponse',
        Payload=json.dumps({'keyName': keyName})
    )
    payload = response['Payload'].read().decode('utf-8')
    result = json.loads(payload)
    return result