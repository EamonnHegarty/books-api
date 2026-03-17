variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "books-api-prod"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "europe-west1"
}

variable "anthropic_api_key" {
  description = "Anthropic API key"
  type        = string
  sensitive   = true
}

variable "google_books_api_key" {
  description = "Google Books API key"
  type        = string
  sensitive   = true
}

variable "image" {
  description = "Docker image to deploy"
  type        = string
}