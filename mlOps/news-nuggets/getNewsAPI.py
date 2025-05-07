import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('NewsArticles')  # replace with your actual table name

def lambda_handler(event, context):
    params = event.get('queryStringParameters') or {}
    limit = int(params.get('limit', 20))
    last_key = params.get('lastKey')

    scan_args = {'Limit': limit}
    if last_key:
        scan_args['ExclusiveStartKey'] = {'article_id': last_key}

    # headers = {
    #     'Access-Control-Allow-Origin': '*',
    #     'Access-Control-Allow-Headers': 'Content-Type',
    #     'Access-Control-Allow-Methods': 'OPTIONS,POST'
    # }
    try:
        response = table.scan(**scan_args)

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'items': response.get('Items', []),
                'lastKey': response.get('LastEvaluatedKey', {}).get('article_id')
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
