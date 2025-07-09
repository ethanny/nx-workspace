## Generate a New App with NX CLI

To create a new NEST application using the NX CLI, run the following command in your terminal:


./generate-service.sh [parent-folder] [app-name] [trigger-type] [sqs-queue-name]
e.g. ./generate-service.sh misc test-service API 
e.g. ./generate-service.sh authentication authentication-event-log-service SQS test-queue-name



IMPORTANT: 
- Add the necessary packages / library on project.json if nx workspace didn't include them during the build process


## Genereate Terraform DynamoDB Table

node generate-dynamodb-tf.js [terraform-stage]

e.g. node generate-dynamodb-tf.js dev

-- this will read all the schema files in the libs/backend/dynamo-db-lib/src/lib/schema folder and generate the terraform code for each schema file and save it to the terraform/[terraform-stage] folder


## Generate DynamoDB Localstack Scripts

node generate-dynamodb-localstack.js <region>

e.g. node generate-dynamodb-localstack.js eu-west-2

-- this will read all the schema files in the libs/backend/dynamo-db-lib/src/lib/schema folder and generate the localstack scripts for each schema file and save it to the local-stack-scripts folder

## Run Localstack Scripts

./run-local-stack-scripts.sh

-- this will run all the localstack scripts in the local-stack-scripts folder
-- a Docker container must be running and the localstack service must be started


## How to run the localstack docker container

docker-compose up

## How to run the localstack docker container with persisted data

docker-compose -f docker-compose-persisted.yml up

## How to download the localstack docker image (Optional if you don't want to use docker-compose)

docker pull localstack/localstack


## initial value for .env.local

STAGE=LOCAL
DEFAULT_REGION=eu-west-2
SERVICE_TRIGGER =LOCALHOST 

#localstack configuration
LOCALSTACK_STATUS=ENABLED
LOCALSTACK_ENDPOINT=http://localhost:4566

#database
DYNAMO_DB_USER_TABLE=user
DYNAMO_DB_EMAIL_TEMPLATE_TABLE=email-template
AWS_SECRET_ID=aws-secret

#sqs 
USER_EVENT_SQS=http://sqs.eu-west-2.localhost.localstack.cloud:4566/000000000000/USER_EVENT_SQS








TERRAFORM NOTES:
- manually create a secret manager record named "terraform_config" with a variable called github_token and add the github_token needed , this is needed for the buildpspec.yml commands
- run the terraform code once on local machine to install the necessay codebuild pipeline needed
- make sure to add the aws_profile on the main.tf (AWS Credentials needed)
- remove the aws_profile variable once the initial local run is successful 
- 