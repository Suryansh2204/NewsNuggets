provider "aws" {
  region = "us-east-1"
}

# Variables for reusability
locals {
  runtime        = "python3.13"
  architecture   = "arm64"
  timeout        = 180
  role_arn       = "arn:aws:iam::800926736763:role/LabRole"
  layer_arn      = "arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python313-Arm64:1"
}

# for secrets manager
variable "open_ai_key" {
  type      = string
  sensitive = true
}

resource "aws_secretsmanager_secret" "apikeys" {
  name = "apikeys"
}

resource "aws_secretsmanager_secret_version" "apikey_value" {
  secret_id     = aws_secretsmanager_secret.apikeys.id
  secret_string = jsonencode({
    OPEN_AI_KEY = var.open_ai_key
  })
}


# # S3 Bucket
# resource "aws_s3_bucket" "news_bucket" {
#   bucket = "news-nuggets-bucket"

#   tags = {
#     Name = "News Nuggets Bucket"
#   }
# }

# S3 'folders' (prefixes with placeholder files)
# resource "aws_s3_object" "news_api_folder" {
#   bucket = aws_s3_bucket.news_bucket.id
#   key    = "news-api/.keep"
#   content = ""
# }

# resource "aws_s3_object" "news_data_folder" {
#   bucket = aws_s3_bucket.news_bucket.id
#   key    = "news-data/.keep"
#   content = ""
# }

# resource "aws_s3_object" "news_org_folder" {
#   bucket = aws_s3_bucket.news_bucket.id
#   key    = "news-org/.keep"
#   content = ""
# }
# resource "aws_s3_object" "scrapped_news_folder" {
#   bucket = aws_s3_bucket.news_bucket.id
#   key    = "scrapped_news/.keep"
#   content = ""
# }



# # Lambda Function Template
# resource "aws_lambda_function" "get_news" {
#   function_name    = "get_news"
#   filename         = "get_news.zip"
#   handler          = "get_news.lambda_handler"
#   runtime          = local.runtime
#   architectures    = [local.architecture]
#   role             = local.role_arn
#   source_code_hash = filebase64sha256("get_news.zip")
#   timeout          = local.timeout
#   layers           = [local.layer_arn]
# }

# resource "aws_lambda_function" "get_secrets" {
#   function_name    = "get_secrets"
#   filename         = "get_secrets.zip"
#   handler          = "get_secrets.lambda_handler"
#   runtime          = local.runtime
#   architectures    = [local.architecture]
#   role             = local.role_arn
#   source_code_hash = filebase64sha256("get_secrets.zip")
#   timeout          = local.timeout
#   layers           = [local.layer_arn]
# }

# resource "aws_lambda_function" "summarize_and_categorize" {
#   function_name    = "summarize_and_categorize"
#   filename         = "summarize_and_categorize.zip"
#   handler          = "summarize_and_categorize.lambda_handler"
#   runtime          = local.runtime
#   architectures    = [local.architecture]
#   role             = local.role_arn
#   source_code_hash = filebase64sha256("summarize_and_categorize.zip")
#   timeout          = local.timeout
#   layers           = [local.layer_arn]
# }
resource "aws_lambda_function" "news_scraper" {
  function_name    = "news_scraper"
  filename         = "news_scraper.zip"
  handler          = "news_scraper.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("news_scraper.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]
}

# Kinesis Data Stream
resource "aws_kinesis_stream" "news_stream" {
  name             = "news-stream"
  shard_count      = 1
  retention_period = 24  # hours (default is 24, max is 8760)

  stream_mode_details {
    stream_mode = "PROVISIONED"
  }

  tags = {
    Name = "News Stream"
    Environment = "Production"
  }
}

# DynamoDB Table
resource "aws_dynamodb_table" "news_articles" {
  name           = "NewsArticles"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "article_id"
  range_key      = "publishedAt"

  attribute {
    name = "article_id"
    type = "S"
  }

  attribute {
    name = "publishedAt"
    type = "S"
  }

  tags = {
    Name        = "NewsArticles"
    Environment = "Production"
  }
}

# Lambda: consumer
resource "aws_lambda_function" "consumer" {
  function_name    = "consumer"
  filename         = "consumer.zip"
  handler          = "consumer.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("consumer.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]
}

# Kinesis Trigger for Lambda
resource "aws_lambda_event_source_mapping" "kinesis_to_consumer" {
  event_source_arn  = aws_kinesis_stream.news_stream.arn
  function_name     = aws_lambda_function.consumer.arn
  starting_position = "LATEST"
  batch_size        = 9
}

# Lambda Function to get news
resource "aws_lambda_function" "get_news_api" {
  function_name    = "getNewsAPI"
  filename         = "getNewsAPI.zip"
  handler          = "getNewsAPI.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("getNewsAPI.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "news_api" {
  name          = "NewsAPI"
  protocol_type = "HTTP"
}

# Lambda Integration
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.news_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_news_api.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

# API Gateway Route: GET /getnews
resource "aws_apigatewayv2_route" "news_route" {
  api_id    = aws_apigatewayv2_api.news_api.id
  route_key = "GET /getnews"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# API Deployment Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.news_api.id
  name        = "prod"
  auto_deploy = true
}

# Lambda permission to be invoked by API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_news_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.news_api.execution_arn}/*/*/getnews"
}

# step function
resource "aws_sfn_state_machine" "scraper_step_function" {
  name     = "NewsScraperStateMachine"
  role_arn = local.role_arn

  definition = jsonencode({
    Comment = "Trigger news_scraper with retries"
    StartAt = "RunScraper"
    States = {
      RunScraper = {
        Type = "Task"
        Resource = aws_lambda_function.news_scraper.arn
        Retry = [
          {
            ErrorEquals     = ["States.ALL"]
            IntervalSeconds = 300
            MaxAttempts     = 2
            BackoffRate     = 1.0
          }
        ]
        End = true
      }
    }
  })
}


# event bridge
resource "aws_cloudwatch_event_rule" "hourly_trigger" {
  name                = "HourlyStepFunctionTrigger"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "invoke_scraper_step_function" {
  rule      = aws_cloudwatch_event_rule.hourly_trigger.name
  arn       = aws_sfn_state_machine.scraper_step_function.arn
  role_arn  = local.role_arn
}


# from here extra things like cloudwatch, sns, etc.
resource "aws_cloudwatch_log_group" "lambda_news_scraper" {
  name              = "/aws/lambda/${aws_lambda_function.news_scraper.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "lambda_consumer" {
  name              = "/aws/lambda/${aws_lambda_function.consumer.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "lambda_getnews" {
  name              = "/aws/lambda/${aws_lambda_function.get_news_api.function_name}"
  retention_in_days = 7
}

# # error alarm and time alarm not needed for fn
# resource "aws_cloudwatch_metric_alarm" "lambda_scraper_errors" {
#   alarm_name          = "LambdaScraperErrorAlarm"
#   comparison_operator = "GreaterThanThreshold"
#   evaluation_periods  = 1
#   metric_name         = "Errors"
#   namespace           = "AWS/Lambda"
#   period              = 300
#   statistic           = "Sum"
#   threshold           = 0
#   alarm_description   = "Alert when scraper lambda has errors"
#   dimensions = {
#     FunctionName = aws_lambda_function.news_scraper.function_name
#   }
# }
# resource "aws_cloudwatch_metric_alarm" "lambda_scraper_duration" {
#   alarm_name          = "LambdaScraperDurationAlarm"
#   comparison_operator = "GreaterThanThreshold"
#   evaluation_periods  = 1
#   metric_name         = "Duration"
#   namespace           = "AWS/Lambda"
#   period              = 300
#   statistic           = "Average"
#   threshold           = 5000  # ms
#   alarm_description   = "Alert if Lambda duration > 5 seconds"
#   dimensions = {
#     FunctionName = aws_lambda_function.news_scraper.function_name
#   }
# }

# cloudwatch for step fn

# # change the step function as shown below
# resource "aws_cloudwatch_log_group" "step_function_logs" {
#   name              = "/aws/stepfunctions/news_scraper_state_machine"
#   retention_in_days = 7
# }

# resource "aws_sfn_state_machine" "scraper_step_function" {
#   name     = "NewsScraperStateMachine"
#   role_arn = local.role_arn

#   logging_configuration {
#     include_execution_data = true
#     level                  = "ALL"
#     destinations = [
#       {
#         cloudwatch_logs_log_group = aws_cloudwatch_log_group.step_function_logs.arn
#       }
#     ]
#   }

#   definition = jsonencode({
#     Comment = "Trigger news_scraper with retries"
#     StartAt = "RunScraper"
#     States = {
#       RunScraper = {
#         Type = "Task"
#         Resource = aws_lambda_function.news_scraper.arn
#         Retry = [
#           {
#             ErrorEquals     = ["States.ALL"]
#             IntervalSeconds = 300
#             MaxAttempts     = 2
#             BackoffRate     = 1.0
#           }
#         ]
#         End = true
#       }
#     }
#   })
# }


# step fn alert
resource "aws_sns_topic" "step_function_alerts" {
  name = "step-function-failure-alerts"
}

resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.step_function_alerts.arn
  protocol  = "email"
  endpoint  = "your_email@example.com" # Replace with your actual email
}

resource "aws_cloudwatch_metric_alarm" "step_function_failures" {
  alarm_name          = "StepFunctionExecutionFailures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ExecutionsFailed"
  namespace           = "AWS/States"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Alert when step function fails after retries"
  alarm_actions       = [aws_sns_topic.step_function_alerts.arn]
  dimensions = {
    StateMachineArn = aws_sfn_state_machine.scraper_step_function.id
  }
}
