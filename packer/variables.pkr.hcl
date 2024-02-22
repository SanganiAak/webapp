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

variable "app_name" {
  type    = string
  default = "webapp"
}

variable "zone" {
  description = "The GCP zone"
  default     = "us-east1-b"
}

variable "ssh_username" {
  description = "The SSH username"
  type        = string
  default     = "dev"
}

variable "image_family" {
  description = "The image family for the custom image"
  type        = string
  default     = "centos-stream-8-custom"
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "HOST" {
  type = number
}

variable "USER_NAME" {
  type = string
}

variable "PASSWORD" {
  type = string
}

variable "DATABASE" {
  type = string
}

variable "WEBAPP_PORT" {
  type = number
}
