#!/bin/bash

sudo yum install unzip -y

sudo /tmp/webapp/

unzip -o /tmp/webapp.zip -d /tmp/webapp/

# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# sudo dnf module list nodejs
# sudo dnf module enable nodejs:20
# sudo dnf install -y npm

# #!/bin/bash

# # Install NVM (Node Version Manager)
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# # Source NVM scripts to the current session
# export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

# Install Node.js version 21
# nvm install 21

# # Use Node.js version 21
# nvm use 21

# # Confirm the installation
# node -v

# Adding the NodeSource official repository for Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Installing Node.js and npm
sudo yum install -y nodejs

cd /tmp/webapp

export USER_NAME=myUsername
export PASSWORD=myPassword
export DATABASE=myDatabaseName
export HOST=127.0.0.1
export PORT=3000

cat <<EOF > /tmp/webapp/.env
USER_NAME=$USER_NAME
PASSWORD=$PASSWORD
DATABASE=$DATABASE
HOST=$HOST
PORT=$PORT
EOF

#npm install
npm init -y
npm install
npm install express sequelize mysql2 body-parser
npm install bcrypt
npm install dotenv

npm install --save-dev jest supertest
