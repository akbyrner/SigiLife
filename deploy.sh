#!/bin/bash
set -e

KEY_PATH="/home/alex/Documents/login.pem"
REMOTE_USER="ubuntu"
REMOTE_HOST="ec2-18-212-12-3.compute-1.amazonaws.com"
REMOTE_DIR="~/SigiLife"

echo "--- Cleaning old builds ---"
rm -rf dist/

echo "--- Local Build ---"
# Explicitly set production mode so Prisma uses PROD_DATABASE_URL from .env
export NODE_ENV=production
npx prisma generate --schema=server/prisma/schema.prisma
npm run build

echo "--- Syncing files to server ---"
# We exclude .env so your working server credentials are not overwritten by your local machine!
rsync -avz --progress --delete \
    -e "ssh -i $KEY_PATH -o IdentitiesOnly=yes" \
    --exclude '.env' \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'src/' \
    --exclude 'public/' \
    --exclude 'tsconfig.*' \
    --exclude 'vite.config.ts' \
    --exclude 'eslint.config.js' \
    --exclude 'components.json' \
    --exclude 'logs/' \
    --exclude '*.log' \
    ./ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

echo "--- Restarting application on server ---"
ssh -i "$KEY_PATH" -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o IdentitiesOnly=yes \
    "$REMOTE_USER@$REMOTE_HOST" "
    cd $REMOTE_DIR &&
    npm install &&
    npx prisma migrate deploy --schema=server/prisma/schema.prisma &&
    npx prisma generate --schema=server/prisma/schema.prisma &&
    pm2 restart ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
    "

echo "--- Deployment Complete ---"
