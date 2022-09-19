#!/bin/sh

# Before starting the server, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.

set -ex
npx prisma migrate deploy
npm run start
