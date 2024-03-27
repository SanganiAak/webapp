#!/bin/bash

sudo yum install unzip -y

unzip -o /tmp/webapp.zip -d /tmp/webapp/

curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

sudo yum install -y nodejs

# adding logs for the application
sudo mkdir -p /var/webapp/
sudo touch /var/webapp/myapp.log
sudo chown csye6225:csye6225 /var/webapp/myapp.log
sudo chmod -R u+rX /var/webapp/myapp.log

cd /tmp/webapp

# export USER_NAME=myUsername
# export PASSWORD=myPassword
# export DATABASE=myDatabaseName
# export HOST=127.0.0.1
# export PORT=3000

# cat <<EOF > /tmp/webapp/.env
# USER_NAME=$USER_NAME
# PASSWORD=$PASSWORD
# DATABASE=$DATABASE
# HOST=$HOST
# PORT=$PORT
# EOF

npm init -y
npm install
npm install express sequelize mysql2 body-parser
npm install bcrypt
npm install dotenv
npm install bunyan 
npm install @google-cloud/pubsub

npm install --save-dev jest supertest
