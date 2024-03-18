source "googlecompute" "centos_custom_image" {
  project_id          = var.project_id
  source_image_family = var.source_image_family
  disk_size           = 100
  zone                = var.zone
  ssh_username        = var.ssh_username
  image_description   = "Custom CentOS Stream 8 image"

  image_labels = {
    purpose = "webapp-image"
  }
}

build {
  sources = [
    "source.googlecompute.centos_custom_image"
  ]

  provisioner "file" {
    source      = "./shell/"
    destination = "/tmp/"
  }

  provisioner "shell" {
    inline = [
      # "sh /tmp/mysql_install.sh",
      "sh /tmp/create_user.sh",
      "sudo sh /tmp/requirements.sh"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo sh /tmp/start.sh"
    ]
  }
}
