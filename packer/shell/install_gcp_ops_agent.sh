#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install


sudo systemctl enable google-cloud-ops-agent.service
sudo systemctl start google-cloud-ops-agent.service

sudo touch /var/webapp/opsconfig.yaml 
sudo mv /etc/google-cloud-ops-agent/config.yaml /var/webapp/opsconfig.yaml 
cat <<EOT > /var/webapp/opsconfig.yaml  
logging:
  receivers:
    files:
      type: files
      include_paths:
      - /var/webapp/*.log
      parser:
        type: json
  service:
    pipelines:
      logs:
        receivers:
        - files
EOT

sudo mv /var/webapp/opsconfig.yaml  /etc/google-cloud-ops-agent/config.yaml

sudo systemctl daemon-reload
sudo systemctl restart google-cloud-ops-agent.service
