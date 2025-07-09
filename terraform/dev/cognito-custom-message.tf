

resource "null_resource" "cognito-custom-message-docker_image" {
  depends_on = [ module.cognito-custom-message-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.cognito-custom-message-service-ecr.token_proxy_endpoint} -u AWS -p ${module.cognito-custom-message-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.cognito-custom-message-service-ecr.repository_url}:latest >> output.txt && docker push ${module.cognito-custom-message-service-ecr.repository_url}:latest >> output.txt"
  }
}


module "cognito-custom-message-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-cognito-custom-message-service"
}



module "cognito-custom-message-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-cognito-custom-message-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.cognito-custom-message-service-ecr.repository_url}:latest"
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.lambda_security_group_outbound_only.security_group_id]
  timeout            = 900
  memory_size        = 128
  environment_variables = {
    AWS_SECRET_ID          = "${module.secret_manager.secret_name}"
    DEFAULT_REGION         = "${var.aws_region}"
    DYNAMO_DB_EMAIL_TEMPLATE_TABLE = "${var.project}-${var.environment}-email-template"
  }
  depends_on = [ null_resource.cognito-custom-message-docker_image ]

}
