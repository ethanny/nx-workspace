

variable "cognito_pool_name" {
  description = "Cognito pool name"
  type        = string
}

variable "cognito_client_name" {
  description = "Cogntio client name"
  type        = string
}

variable "cognito_domain_name" {
  description = "Cognito domain name"
  type        = string
}

variable "sms_iam_role" {
  description = "IAM role for SMS"
  type        = string
  
}
variable "sms_external_id" {
  description = "External ID for SMS"
  type        = string
  
}

variable "custom_message_lambda_arn" {
  description = "Custom message lambda arn"
  type        = string
}



resource "aws_cognito_user_pool" "main" {
  name = var.cognito_pool_name

  password_policy {
    minimum_length                   = 8
    require_uppercase                = true
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  username_attributes = ["email"]

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Your verification code is {####}."
    email_subject        = "Your verification code"
  }

  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  admin_create_user_config {
    allow_admin_create_user_only = false

    invite_message_template {
      email_message = "Your username is {username} and temporary password is {####}."
      email_subject = "Your temporary password"
      sms_message   = "Your username is {username} and temporary password is {####}."
    }
  }

  lambda_config {
    custom_message = var.custom_message_lambda_arn
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = true
    required            = true
  }

  mfa_configuration          = "OPTIONAL"
  sms_authentication_message = "Your code is {####}"
  software_token_mfa_configuration {
    enabled = true
  }

   sms_configuration {
    external_id = var.sms_external_id
    sns_caller_arn = var.sms_iam_role
  }

     lifecycle {

    ignore_changes = [
      password_policy,
      schema
    ]
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name = var.cognito_client_name

  allowed_oauth_flows  = ["code"]
  allowed_oauth_scopes = ["email", "phone", "openid"]
  callback_urls        = ["http://localhost:3000/auth/login"]
  default_redirect_uri = "http://localhost:3000/auth/login"
  logout_urls          = ["http://localhost:3000/auth/logout"]

  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  access_token_validity  = 7
  id_token_validity      = 7
  refresh_token_validity = 30
  

  generate_secret = false
  user_pool_id    = aws_cognito_user_pool.main.id

  supported_identity_providers = ["COGNITO"]
  allowed_oauth_flows_user_pool_client = true

 

  
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.cognito_domain_name
  user_pool_id = aws_cognito_user_pool.main.id
}

output "arn" {
  value = aws_cognito_user_pool.main.arn

}

output "client_id" {
  value = aws_cognito_user_pool_client.main.id
}

output "pool_id" {
  value = aws_cognito_user_pool.main.id
}
