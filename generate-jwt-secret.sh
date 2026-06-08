#!/bin/bash

# Script to generate a secure JWT secret for Render deployment
# Run this command and use the output as JWT_SECRET environment variable

if command -v openssl &> /dev/null; then
    echo "🔐 Generating secure JWT secret..."
    JWT_SECRET=$(openssl rand -hex 32)
    echo ""
    echo "Your JWT_SECRET:"
    echo "================"
    echo "$JWT_SECRET"
    echo ""
    echo "Copy the value above and paste it as the JWT_SECRET in Render environment variables."
else
    echo "❌ OpenSSL not found. Please install OpenSSL or use an online tool:"
    echo "   https://generate-random.org/encryption-keys?count=1&length=64&type=hex&uppercase=false"
fi
