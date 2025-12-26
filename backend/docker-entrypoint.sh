#!/bin/sh

echo "Waiting for database..."
sleep 5

echo "Generating Prisma Client..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate deploy

echo "Running seed..."
node prisma/seed.js

echo "Starting server..."
npm start
