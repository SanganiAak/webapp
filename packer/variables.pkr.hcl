variable "project_id" {
  description = "The GCP project ID"
}

variable "region" {
  description = "The GCP region"
  default     = "us-east1"
}

variable "vpc_name" {
  description = "The name of the VPC"
}

variable "var_count" {
  default = 1
  type    = number
}

variable "app_name" {
  type    = string
  default = "webapp"
}
variable "database" {
  type    = string
  default = "db"
}

variable "route_next_hop_gateway" {
  type = string
}
variable "route_dest_range" {
  type = string
}

variable "routing_mode" {
  type = string
}

variable "zone" {
  description = "The GCP zone"
  default     = "us-east1-b" 
}

variable "ssh_username" {
  description = "The SSH username"
  type        = string
  default = "dev"
}

variable "image_family" {
  description = "The image family for the custom image"
  type        = string
  default     = "centos-stream-8-custom"
}

variable "GOOGLE_APPLICATION_CREDENTIALS" {
  type    = string
  default = null
}