#!/bin/bash
#
# Setup n8n Growth Engine Workflows
# This script helps you configure and import all n8n workflows
#

set -e

echo "=================================="
echo "n8n GROWTH ENGINE SETUP"
echo "=================================="
echo ""

# Check if n8n is installed
if ! command -v n8n &> /dev/null; then
    echo "❌ n8n is not installed"
    echo "Install with: npm install -g n8n"
    exit 1
fi

echo "✅ n8n is installed"
echo ""

# Check if n8n is running
if ! curl -s http://localhost:5678 > /dev/null 2>&1; then
    echo "⚠️  n8n is not running"
    echo ""
    echo "Starting n8n..."
    echo "Run in another terminal: n8n start"
    echo ""
    read -p "Press Enter once n8n is running at http://localhost:5678..."
fi

echo "✅ n8n is running"
echo ""

# Check for workflow files
echo "📁 Checking workflow files..."
WORKFLOW_DIR="$(dirname "$0")/n8n-workflows"

if [ ! -d "$WORKFLOW_DIR" ]; then
    echo "❌ Workflow directory not found: $WORKFLOW_DIR"
    exit 1
fi

WORKFLOW_COUNT=$(find "$WORKFLOW_DIR" -name "*.json" | wc -l | tr -d ' ')
echo "✅ Found $WORKFLOW_COUNT workflow files"
echo ""

# List workflows
echo "📋 Available workflows:"
for file in "$WORKFLOW_DIR"/*.json; do
    filename=$(basename "$file")
    echo "   - $filename"
done
echo ""

# Instructions for manual import
echo "=================================="
echo "MANUAL IMPORT STEPS"
echo "=================================="
echo ""
echo "1. Open n8n: http://localhost:5678"
echo ""
echo "2. For each workflow file:"
echo "   a. Click 'Workflows' → '+ Add Workflow' → 'Import from File'"
echo "   b. Select the workflow JSON file"
echo "   c. Configure credentials (see N8N_GROWTH_ENGINE.md)"
echo "   d. Activate the workflow"
echo ""
echo "3. Workflows to import (in order):"
echo "   1️⃣  01-ad-platforms-weekly-sync.json (START HERE)"
echo "   2️⃣  02-lead-enrichment.json"
echo "   3️⃣  03-outreach-tracking.json"
echo "   4️⃣  04-dashboard-update.json"
echo ""

# Check for required environment variables
echo "=================================="
echo "CREDENTIAL CHECK"
echo "=================================="
echo ""

ENV_FILE="$HOME/work/synter-media/.env.local"

if [ -f "$ENV_FILE" ]; then
    echo "✅ Found .env.local with credentials"
    
    # Check for key variables
    if grep -q "GOOGLE_ADS_" "$ENV_FILE"; then
        echo "   ✅ Google Ads credentials found"
    fi
    
    if grep -q "MICROSOFT_ADS_" "$ENV_FILE"; then
        echo "   ✅ Microsoft Ads credentials found"
    fi
    
    if grep -q "REDDIT_ADS_" "$ENV_FILE"; then
        echo "   ✅ Reddit Ads credentials found"
    fi
else
    echo "⚠️  .env.local not found at $ENV_FILE"
fi

echo ""

# Check token files
TOKEN_DIR="$HOME/work/client-tools/ad-management"

if [ -f "$TOKEN_DIR/.microsoft_ads_tokens.json" ]; then
    echo "✅ Microsoft Ads tokens found"
fi

if [ -f "$TOKEN_DIR/.reddit_ads_tokens.json" ]; then
    echo "✅ Reddit Ads tokens found"
fi

echo ""
echo "=================================="
echo "NEXT STEPS"
echo "=================================="
echo ""
echo "1. Open n8n: http://localhost:5678"
echo "2. Import workflow: n8n-workflows/01-ad-platforms-weekly-sync.json"
echo "3. Configure credentials in n8n UI"
echo "4. Test the workflow manually"
echo "5. Activate for weekly schedule"
echo ""
echo "📖 Full guide: N8N_GROWTH_ENGINE.md"
echo ""
