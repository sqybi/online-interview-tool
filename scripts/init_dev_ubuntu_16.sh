#!/usr/bin/env bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo bash -c "echo 'deb http://nginx.org/packages/ubuntu/ xenial nginx' >> /etc/apt/sources.list.d/nginx.list"
sudo bash -c "echo 'deb-src http://nginx.org/packages/ubuntu/ xenial nginx' >> /etc/apt/sources.list.d/nginx.list"
sudo apt update
sudo apt install -y git nodejs build-essential

git clone https://github.com/sqybi/online-interview-tool.git
cd online-interview-tool
cp config.js.example config.js

npm install

echo "Done!!!"