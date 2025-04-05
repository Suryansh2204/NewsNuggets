provider "aws" {
  region = "us-east-1"
}

# S3 Bucket
resource "aws_s3_bucket" "news_bucket" {
  bucket = "news-nuggets-bucket"

  tags = {
    Name = "News Nuggets Bucket"
  }
}

# S3 'folders' (prefixes with placeholder files)
resource "aws_s3_object" "news_api_folder" {
  bucket = aws_s3_bucket.news_bucket.id
  key    = "news-api/.keep"
  content = ""
}

resource "aws_s3_object" "news_data_folder" {
  bucket = aws_s3_bucket.news_bucket.id
  key    = "news-data/.keep"
  content = ""
}

resource "aws_s3_object" "news_org_folder" {
  bucket = aws_s3_bucket.news_bucket.id
  key    = "news-org/.keep"
  content = ""
}
resource "aws_s3_object" "scrapped_news_folder" {
  bucket = aws_s3_bucket.news_bucket.id
  key    = "scrapped_news/.keep"
  content = ""
}

# Variables for reusability
locals {
  runtime        = "python3.13"
  architecture   = "arm64"
  timeout        = 180
  role_arn       = "arn:aws:iam::800926736763:role/LabRole"
  layer_arn      = "arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python313-Arm64:1"
}

# Lambda Function Template
resource "aws_lambda_function" "get_news" {
  function_name    = "get_news"
  filename         = "get_news.zip"
  handler          = "get_news.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("get_news.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]
}

resource "aws_lambda_function" "get_secrets" {
  function_name    = "get_secrets"
  filename         = "get_secrets.zip"
  handler          = "get_secrets.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("get_secrets.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]
}

resource "aws_lambda_function" "summarize_and_categorize" {
  function_name    = "summarize_and_categorize"
  filename         = "summarize_and_categorize.zip"
  handler          = "summarize_and_categorize.lambda_handler"
  runtime          = local.runtime
  architectures    = [local.architecture]
  role             = local.role_arn
  source_code_hash = filebase64sha256("summarize_and_categorize.zip")
  timeout          = local.timeout
  layers           = [local.layer_arn]
}
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
