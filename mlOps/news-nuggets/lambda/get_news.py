import boto3
import json
from datetime import datetime
from botocore.exceptions import ClientError
import requests

def lambda_handler(event, context):
    urls, params, headers = get_api_dictionary()
    final_result = []

    for key, url in urls.items():
        payload = params[key]
        header = headers[key]
        result = make_api_call(url, header, payload)
        if result["statusCode"] == 200:
            final_result = get_final_result(result["body"], key)
        save_to_s3(final_result, key)

def save_to_s3(result, key):
    s3 = boto3.client("s3")
    bucket_name = "news-nuggets-bucket"
    subfolder = get_s3_subfolder(key)
    current_date = datetime.now().strftime("%Y-%m-%d")
    subfolder = f"{subfolder}/{current_date}"
    file_name = f"{subfolder}/news.json"
    s3.put_object(Bucket=bucket_name, Key=file_name, Body=json.dumps(result))

def get_final_result(result, key):
    final_result = []
    if key == "NEWS_ORG":
        articles = result["articles"]
        for article in articles:
            interesting_data = {
                "title": article["title"],
                "description": article["description"],
                "url": article["url"],
                "publishedAt": article["publishedAt"],
                "source": article["source"]["name"]
            }
        final_result.append(interesting_data)
    elif key == "NEWS_DATA":
        articles = result["results"]
        for article in articles:
            interesting_data = {
                "title": article["title"],
                "description": article["description"],
                "url": article["link"],
                "publishedAt": article["pubDate"],
                "source": article["source_id"]
            }
        final_result.append(interesting_data)
    return final_result  

def get_s3_subfolder(key):
    subfolders = {
        "NEWS_ORG": "news-org",
        "NEWS_DATA": "news-data"
    }
    return subfolders[key]

def get_api_dictionary():
    urls = {
        "NEWS_ORG": "https://newsapi.org/v2/everything",
        "NEWS_DATA": "https://newsdata.io/api/1/latest",
    }
    params = {
        "NEWS_ORG" : {
            "domains": "bangkokpost.com"
        },
        "NEWS_DATA": {
            "apiKey": get_secret("NEWS_DATA_KEY"),
            "country": "th",
            "language": "en"
        }
    }
    headers = {
        "NEWS_ORG": {
            "Content-Type": "application/json",
            "Authorization": get_secret("NEWS_ORG_KEY")
        },
        "NEWS_DATA": {
            "Content-Type": "application/json"
        }
    }
    return urls, params, headers

def make_api_call(url, headers, payload):
    try:
        response = requests.get(url, headers=headers, params=payload)
        response.raise_for_status()
        result = response.json()
        return {
            "statusCode": 200,
            "body": result
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