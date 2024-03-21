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
    app-receiver:
      type: files
      include_paths:
        - /var/webapp/myapp.log
      record_log_file_path: true
  processors:
    app-processor:
      type: parse_json
      time_key: time
      time_format: "%Y-%m-%dT%H:%M:%S.%LZ"
    move_severity:
      type: modify_fields
      fields:
        severity:
          move_from: jsonPayload.severity
  service:
    pipelines:
      default_pipeline:
        receivers: [app-receiver]
        processors: [app-processor, move_severity]
EOT

sudo mv /var/webapp/opsconfig.yaml  /etc/google-cloud-ops-agent/config.yaml

sudo systemctl daemon-reload
sudo systemctl restart google-cloud-ops-agent.service
