#!/bin/bash

apt-get update
apt-get install -y python-dev
curl -O https://bootstrap.pypa.io/get-pip.py
python get-pip.py
pip install awscli

aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region "eu-west-1"
