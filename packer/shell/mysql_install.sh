#!/bin/bash

# Install MySQL
sudo rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl status mysqld


# Enable the new service to start at boot
sudo systemctl enable mysqld

# Start the new service
sudo systemctl start mysqld

# Optionally, check the status of the new service
sudo systemctl status mysqld

# MySQL commands
mysql -u root <<EOF
CREATE DATABASE myDatabaseName;
CREATE USER 'myUsername'@'localhost' IDENTIFIED BY 'myPassword';
GRANT ALL PRIVILEGES ON myDatabaseName.* TO 'myUsername'@'localhost';
FLUSH PRIVILEGES;
EOF
