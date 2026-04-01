#!/bin/bash

KEY_PATH="/home/hopeyclarkey/.ssh/StackMates.pem"
REMOTE_USER="ec2-user"
REMOTE_HOST="18.223.34.170"
REMOTE_DIR="~/SigiLife"

echo "--- Local Build ---"

npm run build

echo "--- Syncing files to server ---"
rsync -avz --progress \
    -e "ssh -i /home/hopeyclarkey/.ssh/StackMates.pem" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'src/' \
    --exclude 'server/' \
    --exclude 'tsconfig.*' \
    --exclude 'vite.config.ts' \
    ./ ec2-user@18.223.34.170:~/SigiLife/


echo "--- Syncing node_modules ---"
rsync -avz --progress \
    -e "ssh -i $KEY_PATH -o ServerAliveInterval=60 -o ServerAliveCountMax=3" \
    ./node_modules "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

echo "--- Restarting application on server ---"
ssh -i "$KEY_PATH" -o ServerAliveInterval=60 -o ServerAliveCountMax=3 \
    "$REMOTE_USER@$REMOTE_HOST" "
    export PATH=\$PATH:/home/ec2-user/.nvm/versions/node/v20.20.0/bin &&
    cd $REMOTE_DIR &&
    pm2 startOrRestart ecosystem.config.cjs --env production
    "
echo "--- Deployment Complete ---"