terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project     = var.project_id
  region      = var.region
}

# Cloud Run staging service
resource "google_cloud_run_v2_service" "staging" {
  name     = "books-api-staging"
  location = var.region

  template {
    containers {
      image = var.image

      env {
        name  = "ANTHROPIC_API_KEY"
        value = var.anthropic_api_key
      }

      env {
        name  = "GOOGLE_BOOKS_API_KEY"
        value = var.google_books_api_key
      }

      env {
        name  = "NODE_ENV"
        value = "staging"
      }
    }
  }
}

# Cloud Run production service
resource "google_cloud_run_v2_service" "prod" {
  name     = "books-api-prod"
  location = var.region

  template {
    containers {
      image = var.image

      env {
        name  = "ANTHROPIC_API_KEY"
        value = var.anthropic_api_key
      }

      env {
        name  = "GOOGLE_BOOKS_API_KEY"
        value = var.google_books_api_key
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}

# Allow unauthenticated access to staging
resource "google_cloud_run_v2_service_iam_member" "staging_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.staging.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Allow unauthenticated access to prod
resource "google_cloud_run_v2_service_iam_member" "prod_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.prod.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}