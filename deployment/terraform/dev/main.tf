variable "username" {
  type = string
}


variable "subscriptionId" {
  type = string
}

variable "servicePrincipalJSON" {
  type = string
}


module "resources" {
  source = "../resources"

  environment          = var.username
  subscriptionId       = var.subscriptionId
  servicePrincipalJSON = var.servicePrincipalJSON
  region               = "West Europe"
  aks_node_count       = 1
}

terraform {
  backend "azurerm" {
    resource_group_name  = "pc-test-manual-resources"
    storage_account_name = "pcdevseedtesttfstate"
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


