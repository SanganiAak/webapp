#!/bin/bash

#create .env file
cat <<EOF > .env
USER_NAME=$USER_NAME
PASSWORD=$PASSWORD
DATABASE=$DATABASE
HOST=$HOST
PORT=$PORT
EOF

# Installing required Node.js packages
npm init -y
npm install
npm install express sequelize mysql2 body-parser
npm install bcrypt
npm install dotenv
npm install bunyan


npm install --save-dev jest supertest

#Starting server
node app.js 