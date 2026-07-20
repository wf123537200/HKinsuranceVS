#!/bin/bash
# Pre-push check: runs unit tests before allowing push.
# Hook this up by adding to .git/hooks/pre-push:
#   ln -s ../../scripts/pre-push-check.sh .git/hooks/pre-push
set -e

echo "🧪 Running unit tests before push..."
npm test -- --silent

echo "✅ Tests passed. Proceeding with push."