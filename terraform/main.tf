terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {}

resource "docker_network" "codefortify_network" {
  name = "codefortify-network"
}

resource "docker_image" "backend" {
  name = "codefortify-backend:latest"
  keep_locally = true
}

resource "docker_image" "frontend" {
  name = "codefortify-frontend:latest"
  keep_locally = true
}

resource "docker_container" "backend" {
  name  = "codefortify-backend-tf"
  image = docker_image.backend.image_id

  networks_advanced {
    name = docker_network.codefortify_network.name
  }

  ports {
    internal = 5000
    external = 5000
  }
}

resource "docker_container" "frontend" {
  name  = "codefortify-frontend-tf"
  image = docker_image.frontend.image_id

  networks_advanced {
    name = docker_network.codefortify_network.name
  }

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [docker_container.backend]
}
