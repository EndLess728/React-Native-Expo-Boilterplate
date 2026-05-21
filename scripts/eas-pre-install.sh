#!/bin/sh
# Runs before `npm install` on EAS build servers (eas-build-pre-install hook).
# Locally: copies the matching .env.<APP_ENV> file to .env.local.
# On EAS: env vars are already injected into process.env by EAS — no file needed.

# EAS sets NODE_OPTIONS=--require tsx/cjs early to evaluate app.config.ts.
# Clear it so it doesn't bleed into subsequent node/npm commands before
# node_modules are installed (tsx/cjs isn't resolvable until after yarn install).
unset NODE_OPTIONS

APP_ENV="${EXPO_PUBLIC_APP_ENV:-development}"

# If the env file exists locally, use it.
if [ -f ".env.${APP_ENV}" ]; then
  cp ".env.${APP_ENV}" .env.local
  echo "Copied .env.${APP_ENV} to .env.local"
  exit 0
fi

# On EAS build servers, env vars are injected directly into process.env by EAS.
# The eas CLI is not available at this stage, and there's nothing to pull.
if [ "${EAS_BUILD}" = "true" ]; then
  echo "Running on EAS — env vars are injected by EAS into process.env, no pull needed."
  exit 0
fi

# Local fallback: pull from EAS CLI (requires eas-cli to be installed globally).
case "${APP_ENV}" in
  staging) EAS_ENV="preview" ;;
  *)       EAS_ENV="${APP_ENV}" ;;
esac

echo "No .env.${APP_ENV} found — pulling from EAS (${EAS_ENV})..."
eas env:pull "${EAS_ENV}" --path .env.local --non-interactive
