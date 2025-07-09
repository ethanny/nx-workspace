module "email-api-service-ecr" {
  source          = "../modules/aws_ecr"
  repository_name = "${var.project}-${var.environment}-email-api-service"
}


resource "null_resource" "email-api-service-docker_image" {
  depends_on = [ module.email-api-service-ecr ]
  provisioner "local-exec" {
   command = "docker login ${module.email-api-service-ecr.token_proxy_endpoint} -u AWS -p ${module.email-api-service-ecr.token_password} >> output.txt && docker info >> output.txt && docker pull alpine >> output.txt && docker tag alpine ${module.email-api-service-ecr.repository_url}:latest >> output.txt && docker push ${module.email-api-service-ecr.repository_url}:latest >> output.txt"
  }
}

module "email-api-service-lambda" {
  source             = "../modules/aws_lambda_docker"
  function_name      = "${var.project}-${var.environment}-email-api-service"
  role_arn           = module.lamda_task_role.role_arn
  docker_image_uri   = "${module.email-api-service-ecr.repository_url}:latest"
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
  depends_on = [ null_resource.email-api-service-docker_image ]
}


