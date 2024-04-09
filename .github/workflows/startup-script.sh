#!/bin/bash

sudo tee /tmp/webapp/.env > /dev/null <<'EOF'
USER_NAME=webapp
PASSWORD=PFHmTWcl0OZ7eMNf
DATABASE=myDatabaseName
HOST=172.22.0.2
PORT=3000
EOF

sudo systemctl daemon-reload
sudo systemctl enable webapp_start.service
sudo systemctl start webapp_start.service
