output "staging_url" {
  description = "Staging Cloud Run URL"
  value       = google_cloud_run_v2_service.staging.uri
}

output "prod_url" {
  description = "Production Cloud Run URL"
  value       = google_cloud_run_v2_service.prod.uri
}