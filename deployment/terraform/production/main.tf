variable "username" {
  type = string
}


variable "subscriptionId" {
  type = string
}

variable "postgres_password" {
  type = string
}

variable "signing_secret" {
  type = string
}

variable "auth0BaseUrl" {
  type = string
}

module "resources" {
  source = "../resources"

  environment          = "production"
  subscriptionId       = var.subscriptionId
  region               = "West Europe"
  aks_node_count       = 1
  
  postgres_password    = var.postgres_password
  signing_secret       = var.signing_secret
  auth0BaseUrl         = var.auth0BaseUrl

  admin_email          = "sanjay@developmentseed.org"
  placeholder_is_gpu   = false
  placeholder_num_gpus = 0

  placeholder_node_selector_name = "cpunodepool"

  gpu_count = 4

  nginx_enabled = true
  frontend_domain = "landcover.io"

  domain = "lulc.ds.io"
}

terraform {
  backend "azurerm" {
    resource_group_name  = "lulcterraformdev"
    storage_account_name = "lulcterraformstate"
    container_name       = "lulc-dev"
    key                  = "production.terraform.tfstate"
  }
}

output "resources" {
  value     = module.resources
  sensitive = true
}


