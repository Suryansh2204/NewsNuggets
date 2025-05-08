## How to Compress Files in windows

```
cd ./mlOps/news-nuggets
```

```
Compress-Archive -Path ./lambda/news_scraper.py -DestinationPath news_scraper.zip
Compress-Archive -Path ./lambda/consumer.py -DestinationPath consumer.zip
Compress-Archive -Path ./lambda/getNewsAPI.py -DestinationPath getNewsAPI.zip
Compress-Archive -Path ./lambda/signup.py -DestinationPath signup.zip
Compress-Archive -Path ./lambda/login.py -DestinationPath login.zip
```

## Configure AWS (If not already)

If aws cli is not installed then go to [AWS CLI DOWNLOAD for windows](https://awscli.amazonaws.com/AWSCLIV2.msi)

> then open the terminal from the news-nuggets directory

from inside the `news-nuggets` directory

```
aws configure
```

- To find the details, go to `Learners Lab` and click on `AWS Details` beside the `End Lab` button, you will get the details from there

```
AWS Access Key ID [None]: <paste here>
AWS Secret Access Key [None]: <paste here>
Default region name [None]: us-east-1
Default output format [None]: json
```

#### If there si some problem while running terraform, do the following

In windows terminal, at the same memory location paste the following

```
$env:AWS_ACCESS_KEY_ID="PASTE_HERE"
$env:AWS_SECRET_ACCESS_KEY="PASTE_HERE"
$env:AWS_SESSION_TOKEN="PASTE_HERE"
$env:AWS_DEFAULT_REGION="us-east-1"
```

To check if these values are being set, run the following command

```
Get-ChildItem Env:AWS*
```

## Run Terraform:

Goto [Download Terraform](https://developer.hashicorp.com/terraform/downloads)

- Extract it
- Paste the installer inside the news-nuggets folder and run it then

```
terraform init          # initialize
terraform validate      # validate the config ( check for any syntax error)
terraform plan          # see the execution plan
terraform apply         # Apply the config (deploy to aws)
```

<!-- Fake news -->

#### Delete secrets

```
aws secretsmanager delete-secret --secret-id apikeys --force-delete-without-recovery
```
