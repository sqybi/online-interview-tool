#!/usr/bin/env bash
pwd | tail -c 8 | grep 'scripts' &> /dev/null
if [[ $? == 0 ]]; then
    cd ..
fi

git pull
npm install
sudo systemctl restart pm2-${USER}.service