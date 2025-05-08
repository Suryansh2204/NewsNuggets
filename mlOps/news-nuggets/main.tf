provider "aws" {
  region = "us-east-1"
}

# ───── Locals for reusability ─────
locals {
  runtime        = "python3.13"
  architecture   = "arm64"
  timeout        = 180
  role_arn       = "arn:aws:iam::800926736763:role/LabRole"
  layer_arn      = "arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python313-Arm64:1"
}

# ───── Secrets Manager for OpenAI Key ─────
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

# ───── Lambda Functions ─────
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

resource "aws_lambda_function" "signup" {
  function_name    = "signup"
  filename         = "signup.zip"                             
  handler          = "signup.lambda_handler"                  
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("signup.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]                        

  environment {
    variables = {
      USERS_TABLE = aws_dynamodb_table.users.name
    }
  }
}

resource "aws_lambda_function" "login" {
  function_name    = "login"
  filename         = "login.zip"
  handler          = "login.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("login.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]

  environment {
    variables = {
      USERS_TABLE = aws_dynamodb_table.users.name
    }
  }
}

# ───── Kinesis Stream ─────
resource "aws_kinesis_stream" "news_stream" {
  name             = "news-stream"
  shard_count      = 1
  retention_period = 24

  stream_mode_details {
    stream_mode = "PROVISIONED"
  }

  tags = {
    Name        = "News Stream"
    Environment = "Production"
  }
}

# ───── Lambda Kinesis Trigger ─────
resource "aws_lambda_event_source_mapping" "kinesis_to_consumer" {
  event_source_arn  = aws_kinesis_stream.news_stream.arn
  function_name     = aws_lambda_function.consumer.arn
  starting_position = "LATEST"
  batch_size        = 9
}

# ───── DynamoDB Table ─────
# news_articles table with article_id as hash key and publishedAt as range key
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

# users table with email as hash key
resource "aws_dynamodb_table" "users" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"

  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "UsersTable"
    Environment = "Production"
  }
}



# ───── API Gateway for get_news_api ─────
resource "aws_apigatewayv2_api" "news_api" {
  name          = "NewsAPI"
  protocol_type = "HTTP"

  cors_configuration {
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = ["*"]  # OR ["https://yourdomain.com"] for more security
    allow_credentials = false
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                = aws_apigatewayv2_api.news_api.id
  integration_type      = "AWS_PROXY"
  integration_uri       = aws_lambda_function.get_news_api.invoke_arn
  integration_method    = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "news_route" {
  api_id    = aws_apigatewayv2_api.news_api.id
  route_key = "GET /getnews"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_deployment" "api_deployment" {
  api_id = aws_apigatewayv2_api.news_api.id

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_apigatewayv2_route.news_route,
    aws_apigatewayv2_route.signup_route,
    aws_apigatewayv2_route.login_route
  ]
}


resource "aws_apigatewayv2_stage" "default" {
  api_id        = aws_apigatewayv2_api.news_api.id
  name          = "prod"
  deployment_id = aws_apigatewayv2_deployment.api_deployment.id
  auto_deploy   = true
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_news_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.news_api.execution_arn}/*/*/getnews"
}

# ───── API Gateway for signup ─────
# API Integration
resource "aws_apigatewayv2_integration" "signup_lambda_integration" {
  api_id                = aws_apigatewayv2_api.news_api.id
  integration_type      = "AWS_PROXY"
  integration_uri       = aws_lambda_function.signup.invoke_arn
  integration_method    = "POST"
  payload_format_version = "2.0"
}

# Route for POST /signup
resource "aws_apigatewayv2_route" "signup_route" {
  api_id    = aws_apigatewayv2_api.news_api.id
  route_key = "POST /signup"
  target    = "integrations/${aws_apigatewayv2_integration.signup_lambda_integration.id}"
}

# Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "signup_api_permission" {
  statement_id  = "AllowAPIGatewayInvokeSignup"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.signup.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.news_api.execution_arn}/*/*/signup"
}

# ───── API Gateway for login ─────
resource "aws_apigatewayv2_integration" "login_lambda_integration" {
  api_id                = aws_apigatewayv2_api.news_api.id
  integration_type      = "AWS_PROXY"
  integration_uri       = aws_lambda_function.login.invoke_arn
  integration_method    = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "login_route" {
  api_id    = aws_apigatewayv2_api.news_api.id
  route_key = "POST /login"
  target    = "integrations/${aws_apigatewayv2_integration.login_lambda_integration.id}"
}

resource "aws_lambda_permission" "login_api_permission" {
  statement_id  = "AllowAPIGatewayInvokeLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.login.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.news_api.execution_arn}/*/*/login"
}


# ───── Step Function with Logging ─────
resource "aws_cloudwatch_log_group" "step_function_logs" {
  name              = "/aws/stepfunctions/news_scraper_state_machine"
  retention_in_days = 7

  lifecycle {
    ignore_changes = [retention_in_days]
  }
}


resource "aws_sfn_state_machine" "scraper_step_function" {
  name     = "NewsScraperStateMachine"
  role_arn = local.role_arn

  logging_configuration {
    include_execution_data = true
    level                  = "ALL"
    log_destination        = "${aws_cloudwatch_log_group.step_function_logs.arn}:*"
  }

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



# ───── EventBridge Scheduled Trigger ─────
resource "aws_cloudwatch_event_rule" "hourly_trigger" {
  name                = "HourlyStepFunctionTrigger"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "invoke_scraper_step_function" {
  rule     = aws_cloudwatch_event_rule.hourly_trigger.name
  arn      = aws_sfn_state_machine.scraper_step_function.arn
  role_arn = local.role_arn
}

# ───── CloudWatch Logs for Lambda ─────
resource "aws_cloudwatch_log_group" "lambda_news_scraper" {
  name              = "/aws/lambda/${aws_lambda_function.news_scraper.function_name}"
  retention_in_days = 7

  lifecycle {
    ignore_changes = [retention_in_days]
  }
}

resource "aws_cloudwatch_log_group" "lambda_consumer" {
  name              = "/aws/lambda/${aws_lambda_function.consumer.function_name}"
  retention_in_days = 7

  lifecycle {
    ignore_changes = [retention_in_days]
  }
}

resource "aws_cloudwatch_log_group" "lambda_getnews" {
  name              = "/aws/lambda/${aws_lambda_function.get_news_api.function_name}"
  retention_in_days = 7

  lifecycle {
    ignore_changes = [retention_in_days]
  }
}

resource "aws_cloudwatch_log_group" "lambda_signup" {
  name              = "/aws/lambda/${aws_lambda_function.signup.function_name}"
  retention_in_days = 7
  lifecycle {
    ignore_changes = [retention_in_days]
  }
}


resource "aws_cloudwatch_log_group" "lambda_login" {
  name              = "/aws/lambda/${aws_lambda_function.login.function_name}"
  retention_in_days = 7

  lifecycle {
    ignore_changes = [retention_in_days]
  }
}

# ───── SNS Topic for Step Function Failures ─────
resource "aws_sns_topic" "step_function_alerts" {
  name = "step-function-failure-alerts"
}

resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.step_function_alerts.arn
  protocol  = "email"
  endpoint  = "suryanshsrivastava22@gmail.com" 
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

# ───── OPTIONAL: S3 Bucket and Folder Setup (currently commented) ─────
# Uncomment below if using S3 storage

# resource "aws_s3_bucket" "news_bucket" {
#   bucket = "news-nuggets-bucket"
#   tags = {
#     Name = "News Nuggets Bucket"
#   }
# }

# resource "aws_s3_object" "news_api_folder" {
#   bucket  = aws_s3_bucket.news_bucket.id
#   key     = "news-api/.keep"
#   content = ""
# }

# ... (repeat for other folders as needed)
