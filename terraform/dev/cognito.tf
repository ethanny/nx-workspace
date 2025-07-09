#COGNITO

resource "aws_lambda_permission" "custom_message_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = module.cognito-custom-message-service-lambda.lambda_function_arn
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = module.cognito_user_pool.arn
}




#Cognito IAM ROLE FOR SMS Configuration

# Cognito User Pool
module "cognito_user_pool" {
  source              = "../modules/aws_cognito"
  cognito_client_name = "${var.project}-${var.environment}-cognito-client"
  cognito_pool_name   = "${var.project}-${var.environment}-user-pool"
  sms_iam_role        = module.sms_iam_role.role_arn
  sms_external_id     = module.sms_uuid.uuid
  cognito_domain_name = "${var.project}-${var.environment}-domain"
  custom_message_lambda_arn = module.cognito-custom-message-service-lambda.lambda_function_arn
}