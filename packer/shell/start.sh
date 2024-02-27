#!/bin/bash

sudo chown -R csye6225:csye6225 /tmp/webapp
sudo chmod -R u+rX /tmp/webapp

cat <<EOF | sudo tee /etc/systemd/system/webapp_start.service
[Unit]
Description=CSYE 6225 webApp
ConditionPathExists=/tmp/webapp/app.js
ConditionPathExists=/tmp/webapp/.env
After=network.target

[Service]
Type=simple
User=csye6225
Group=csye6225
WorkingDirectory=/tmp/webapp/
EnvironmentFile=/tmp/webapp/.env
ExecStart=/usr/bin/node /tmp/webapp/app.js
Restart=always
RestartSec=3
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=csye6225

[Install]
WantedBy=multi-user.target
EOF

# sudo systemctl daemon-reload
# sudo systemctl enable webapp_start.service
# sudo systemctl start webapp_start.service
# sudo systemctl status webapp_start.service
