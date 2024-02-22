#!/bin/bash
sudo yum install unzip -y

sudo /tmp/webapp/

unzip -o /tmp/webapp.zip -d /tmp/webapp/

curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

sudo yum install -y nodejs

cd /tmp/webapp

export USER_NAME=$1
export PASSWORD=$2
export DATABASE=$3
export HOST=$4
export PORT=$5

cat <<EOF > /tmp/webapp/.env
USER_NAME=$USER_NAME
PASSWORD=$PASSWORD
DATABASE=$DATABASE
HOST=$HOST
PORT=$PORT
EOF

npm init -y
npm install
npm install express sequelize mysql2 body-parser
npm install bcrypt
npm install dotenv

npm install --save-dev jest supertest
