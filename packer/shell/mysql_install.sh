#!/bin/bash

sudo rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl status mysqld


sudo systemctl enable mysqld

sudo systemctl start mysqld

sudo systemctl status mysqld

# mysql -u root <<EOF
# CREATE DATABASE myDatabaseName;
# CREATE USER 'myUsername'@'localhost' IDENTIFIED BY 'myPassword';
# GRANT ALL PRIVILEGES ON myDatabaseName.* TO 'myUsername'@'localhost';
# FLUSH PRIVILEGES;
# EOF
