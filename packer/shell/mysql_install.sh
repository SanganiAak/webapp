#!/bin/bash
export USER_NAME=$1
export PASSWORD=$2
export DATABASE=$3
export HOST=$4
export PORT=$5

sudo rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl status mysqld


sudo systemctl enable mysqld

sudo systemctl start mysqld

sudo systemctl status mysqld

mysql -u root <<EOF
CREATE DATABASE $DATABASE;
CREATE USER '$USER_NAME'@'$HOST' IDENTIFIED BY '$PASSWORD';
GRANT ALL PRIVILEGES ON $DATABASE.* TO '$USER_NAME'@'$HOST';
FLUSH PRIVILEGES;
EOF
