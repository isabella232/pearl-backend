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

  environment          = "dev"
  subscriptionId       = var.subscriptionId
  region               = "West Europe"
  aks_node_count       = 1
  admin_email          = "sanjay@developmentseed.org"
  postgres_password    = var.postgres_password
  signing_secret       = var.signing_secret
  auth0BaseUrl         = var.auth0BaseUrl

  placeholder_is_gpu   = false
  placeholder_num_gpus = 2

  placeholder_node_selector_name = "cpunodepool"

  gpu_count = 2
  domain               = "lulc-test.ds.io"
}

terraform {
  backend "azurerm" {
    resource_group_name  = "lulcterraformdev"
    storage_account_name = "lulcterraformstate"
    container_name       = "lulc-dev"
    key                  = "dev.terraform.tfstate"
  }
}

# terraform {
#   backend "local" {
#     path = "terraform.tfstate"
#   }
# }

output "resources" {
  value     = module.resources
  sensitive = true
}


