import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    return get_secret(event['keyName'])

def get_secret(keyName):
    secret_name = "apikeys"
    region_name = "us-east-1"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e

    secret = json.loads(get_secret_value_response['SecretString'])
    return secret[keyName]