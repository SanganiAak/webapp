#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install


sudo systemctl enable google-cloud-ops-agent.service
sudo systemctl start google-cloud-ops-agent.service

cat <<EOT > /etc/google-cloud-ops-agent/config.yaml
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

sudo systemctl daemon-reload
sudo systemctl restart google-cloud-ops-agent.service
