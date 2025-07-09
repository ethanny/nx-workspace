

module "user-event-handler-service_sqs_queue" {
  source        = "../modules/aws_sqs"
  queue_name    = "${var.project}-${var.environment}-user-event-handler-service-queue"

}



module "user-event-handler-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-user-event-handler-service"
}


resource "null_resource" "user-event-handler-service-docker_image" {
  depends_on = [ module.user-event-handler-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.user-event-handler-service-ecr.token_proxy_endpoint} -u AWS -p ${module.user-event-handler-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.user-event-handler-service-ecr.repository_url}:latest >> output.txt && docker push ${module.user-event-handler-service-ecr.repository_url}:latest >> output-user-event-handler-service.txt"
  }
}

module "user-event-handler-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-user-event-handler-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.user-event-handler-service-ecr.repository_url}:latest"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.lambda_security_group_outbound_only.security_group_id]
  timeout            = 900
  memory_size        = 128
  environment_variables = {
    DYNAMO_DB_USER_TABLE   = "${var.project}-${var.environment}-users"
    AWS_SECRET_ID          = "${module.secret_manager.secret_name}"
    DEFAULT_REGION         = "${var.aws_region}"
  }
  
  depends_on = [ null_resource.user-event-handler-service-docker_image ]

}

resource "aws_lambda_event_source_mapping" "user-event-handler-service_sqs_trigger" {
  event_source_arn = module.user-event-handler-service_sqs_queue.queue_arn
  function_name    = module.user-event-handler-service-lambda.lambda_function_name
}