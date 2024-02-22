#!/bin/bash


if ! getent group csye6225 >/dev/null; then
  sudo groupadd csye6225
fi

if ! id -u csye6225 >/dev/null 2>&1; then
  sudo useradd -m -g csye6225 csye6225 --shell /usr/sbin/nologin
  echo "User csye6225 created and assigned to group csye6225."
else
  echo "User csye6225 already exists."
fi
