# n8n Growth Engine - Complete Setup Guide

This guide will help you set up the complete automated growth engine using n8n.

## 🎯 What This Builds

A fully automated system that:
- ✅ Fetches data from all ad platforms weekly (Google, Microsoft, Reddit, LinkedIn)
- ✅ Enriches leads via Clay
- ✅ Routes qualified leads to Loops (email) and LaGrowthMachine (LinkedIn outreach)
- ✅ Stores everything in BigQuery
- ✅ Auto-updates your dashboard
- ✅ Sends Slack notifications

## 📋 Prerequisites

### Required Accounts:
- [x] Google Ads (you have this)
- [x] Microsoft Ads (you have this)
- [x] Reddit Ads (you have this)
- [ ] LinkedIn Ads OAuth
- [ ] Google Cloud Platform (for BigQuery)
- [ ] Clay account with API access
- [ ] Loops account with API key
- [ ] LaGrowthMachine account with API key
- [ ] PostHog account with API key
- [ ] HubSpot account (optional)
- [ ] Slack workspace (for notifications)

### Required Tokens:
- [x] Microsoft Ads: `~/work/client-tools/ad-management/.microsoft_ads_tokens.json`
- [x] Reddit Ads: `~/work/client-tools/ad-management/.reddit_ads_tokens.json`
- [x] Google Ads: Configured in `~/work/synter-media/.env.local`

---

## 🚀 Setup Steps

### Step 1: Start n8n

```bash
# n8n is already installed and running!
# Access at: http://localhost:5678

# If not running:
n8n start
```

### Step 2: Create BigQuery Dataset

```bash
# 1. Go to Google Cloud Console: https://console.cloud.google.com
# 2. Select or create a project
# 3. Enable BigQuery API
# 4. Create dataset: "growth_data"
```

Run this SQL in BigQuery:

```sql
-- Create dataset
CREATE SCHEMA IF NOT EXISTS growth_data;

-- Ad metrics table
CREATE TABLE IF NOT EXISTS growth_data.ad_metrics (
  week_ending DATE NOT NULL,
  platform STRING NOT NULL,
  spend FLOAT64,
  impressions INT64,
  clicks INT64,
  conversions FLOAT64,
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (week_ending, platform) NOT ENFORCED
);

-- Leads table
CREATE TABLE IF NOT EXISTS growth_data.leads (
  id STRING NOT NULL,
  email STRING,
  created_at TIMESTAMP,
  source STRING,
  utm_source STRING,
  utm_campaign STRING,
  utm_medium STRING,
  enriched_at TIMESTAMP,
  company_name STRING,
  company_size STRING,
  industry STRING,
  linkedin_url STRING,
  icp_score FLOAT64,
  lead_status STRING,
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id) NOT ENFORCED
);

-- Enrichment data
CREATE TABLE IF NOT EXISTS growth_data.enrichment (
  lead_id STRING NOT NULL,
  enriched_at TIMESTAMP,
  company_domain STRING,
  employee_count INT64,
  tech_stack STRING,
  linkedin_company_url STRING,
  industry STRING,
  funding_stage STRING,
  clay_confidence FLOAT64,
  raw_data JSON,
  PRIMARY KEY (lead_id, enriched_at) NOT ENFORCED
);

-- Outreach tracking
CREATE TABLE IF NOT EXISTS growth_data.outreach (
  id STRING NOT NULL,
  lead_id STRING,
  campaign_name STRING,
  platform STRING,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP,
  meeting_booked BOOLEAN,
  status STRING,
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id) NOT ENFORCED
);

-- Conversions
CREATE TABLE IF NOT EXISTS growth_data.conversions (
  id STRING NOT NULL,
  lead_id STRING,
  conversion_type STRING,
  conversion_date DATE,
  source_platform STRING,
  source_campaign STRING,
  value FLOAT64,
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id) NOT ENFORCED
);
```

### Step 3: Create BigQuery Service Account

```bash
# 1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
# 2. Click "Create Service Account"
# 3. Name: "n8n-growth-engine"
# 4. Grant role: "BigQuery Admin"
# 5. Create and download JSON key
# 6. Save as: ~/growth-engine-bigquery-key.json
```

### Step 4: Configure n8n Credentials

Open http://localhost:5678 and add these credentials:

#### 1. Google Ads OAuth2
- **Type**: Google Ads OAuth2 API
- **Client ID**: From `~/work/synter-media/.env.local` → `GOOGLE_ADS_CLIENT_ID`
- **Client Secret**: From `~/work/synter-media/.env.local` → `GOOGLE_ADS_CLIENT_SECRET`
- **Developer Token**: Set as environment variable in n8n

#### 2. Reddit Ads OAuth2
- **Type**: OAuth2 API (Custom)
- **Grant Type**: Authorization Code
- **Authorization URL**: `https://www.reddit.com/api/v1/authorize`
- **Access Token URL**: `https://www.reddit.com/api/v1/access_token`
- **Client ID**: From `.env.local` → `REDDIT_ADS_CLIENT_ID`
- **Client Secret**: From `.env.local` → `REDDIT_ADS_CLIENT_SECRET`
- **Scope**: `adsread`
- **Auth URI Query Parameters**: `duration=permanent`

**OR use existing token:**
- Import from `~/work/client-tools/ad-management/.reddit_ads_tokens.json`

#### 3. LinkedIn Ads OAuth2
- **Type**: LinkedIn OAuth2 API
- **Credentials**: Go through OAuth flow in n8n
- **Scopes**: `r_ads_reporting`, `r_ads`, `r_organization_social`

Steps:
1. In n8n: Add Credential → LinkedIn OAuth2 API
2. Click "Connect my account"
3. Sign in with LinkedIn
4. Grant permissions
5. ✅ Done!

#### 4. BigQuery Service Account
- **Type**: Google Cloud Service Account
- **Service Account Email**: From service account creation
- **Private Key**: Upload `~/growth-engine-bigquery-key.json`

#### 5. GitHub Personal Access Token
- **Type**: Header Auth
- **Name**: `Authorization`
- **Value**: `token YOUR_GITHUB_PAT`

Create token: https://github.com/settings/tokens/new
- Scopes needed: `repo` (full repository access)

#### 6. Clay API Key
- **Type**: Header Auth
- **Name**: `Authorization`
- **Value**: `Bearer YOUR_CLAY_API_KEY`

Get key: https://clay.com/settings/api

#### 7. Loops API Key
- **Type**: Header Auth
- **Name**: `Authorization`
- **Value**: `Bearer YOUR_LOOPS_API_KEY`

Get key: https://app.loops.so/settings?page=api

#### 8. LaGrowthMachine API Key
- **Type**: Header Auth
- **Name**: `X-API-KEY`
- **Value**: `YOUR_LGM_API_KEY`

Get key: LaGrowthMachine dashboard → Settings → API

#### 9. PostHog API Key
- **Type**: Header Auth
- **Name**: `Authorization`
- **Value**: `Bearer YOUR_POSTHOG_API_KEY`

Get key: PostHog → Project Settings → API Keys

#### 10. Slack Webhook (Optional)
- **Type**: Webhook URL
- Create: https://api.slack.com/messaging/webhooks

### Step 5: Set Environment Variables in n8n

Create `~/.n8n/.env` file:

```bash
# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=your_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_LOGIN_CUSTOMER_ID=1234567890
GOOGLE_ADS_CUSTOMER_ID=9876543210

# Microsoft Ads
MICROSOFT_ADS_DEVELOPER_TOKEN=your_token
MICROSOFT_ADS_CLIENT_ID=your_client_id
MICROSOFT_ADS_CUSTOMER_ID=your_customer_id
MICROSOFT_ADS_ACCOUNT_ID=your_account_id

# Reddit Ads
REDDIT_ADS_CLIENT_ID=your_client_id
REDDIT_ADS_CLIENT_SECRET=your_secret

# Google Cloud
GCP_PROJECT_ID=your-project-id

# PostHog
POSTHOG_API_KEY=your_api_key
POSTHOG_PROJECT_ID=176241
POSTHOG_BASE_URL=https://app.posthog.com

# Clay
CLAY_API_KEY=your_api_key

# Loops
LOOPS_API_KEY=your_api_key

# LaGrowthMachine
LGM_API_KEY=your_api_key
LGM_CAMPAIGN_ID=your_campaign_id

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Copy existing values:**
```bash
# Copy from synter-media
cat ~/work/synter-media/.env.local | grep -E "GOOGLE_ADS|MICROSOFT_ADS|REDDIT_ADS|POSTHOG" >> ~/.n8n/.env

# Restart n8n to load environment variables
pkill -f n8n
n8n start
```

### Step 6: Import Workflow

1. Open n8n: http://localhost:5678
2. Click "Add Workflow" (top right)
3. Click "..." → "Import from File"
4. Select: `n8n-workflows/complete-growth-engine.json`
5. The workflow will open with all nodes configured

### Step 7: Configure Credentials in Workflow

Click on each node that shows a red triangle and select the appropriate credential:

- **Google Ads API** → Select "Google Ads OAuth2" credential
- **Reddit Ads API** → Select "Reddit OAuth2" credential
- **LinkedIn Ads API** → Select "LinkedIn OAuth2" credential
- **Insert into BigQuery** → Select "Google BigQuery" credential
- **Get Current app.js** → Select "GitHub Auth" credential
- **Commit to GitHub** → Select "GitHub Auth" credential
- **PostHog: Get Signups** → Select "PostHog Auth" credential
- **Clay: Enrich Lead** → Select "Clay API" credential
- **Loops: Add to Nurture** → Select "Loops API" credential
- **LGM: Add to Outreach** → Select "LGM API" credential
- **HubSpot: Recent Contacts** → Select "HubSpot OAuth2" credential
- **Send Slack Summary** → No credential needed (uses webhook URL)

### Step 8: Test the Workflow

1. Click "Execute Workflow" button (play icon, top right)
2. Watch each node execute in real-time
3. Check for errors (red nodes)
4. Verify data in BigQuery
5. Check dashboard was updated on GitHub

### Step 9: Activate Weekly Schedule

1. Click the toggle at the top: "Inactive" → "Active"
2. The workflow will now run every Monday at 9 AM
3. ✅ Done!

---

## 🔍 Testing Individual Components

### Test Google Ads Fetch:
1. Click "Google Ads API" node
2. Click "Execute node" (or "Test step")
3. Should return: `{ results: [...] }` with campaign data

### Test Reddit Ads Fetch:
1. Click "Reddit Ads API" node
2. Execute node
3. Should return: `{ data: { metrics: [...] } }`

### Test LinkedIn Ads Fetch:
1. Click "LinkedIn Ads API" node
2. Execute node
3. Should return: `{ elements: [...] }` with analytics data

### Test BigQuery Insert:
1. After aggregation nodes complete
2. Click "Insert into BigQuery" node
3. Execute node
4. Verify in BigQuery console: 
   ```sql
   SELECT * FROM growth_data.ad_metrics 
   ORDER BY inserted_at DESC 
   LIMIT 10;
   ```

### Test Dashboard Update:
1. Click "Generate Updated app.js" node
2. Check output shows updated content
3. "Commit to GitHub" should show success
4. Verify commit on GitHub repo

---

## 🐛 Troubleshooting

### "Google Ads: Permission Denied"
- Check `GOOGLE_ADS_LOGIN_CUSTOMER_ID` is set correctly
- Verify OAuth credentials have proper scopes

### "Reddit Ads: 401 Unauthorized"
- Token expired - refresh in n8n or run:
  ```bash
  cd ~/work/client-tools/ad-management
  python3 -c "import json, requests; ... # refresh script"
  ```

### "LinkedIn: 403 Forbidden"
- Re-authenticate OAuth in n8n
- Check scopes include `r_ads_reporting`

### "BigQuery: Permission Denied"
- Verify service account has "BigQuery Admin" role
- Check project ID is correct in `.env`

### "GitHub: 404 Not Found"
- Check GitHub PAT has `repo` scope
- Verify repository path is correct

### Workflow Shows Errors:
1. Click on the red node
2. Check error message in "OUTPUT" tab
3. Common fixes:
   - Re-authenticate OAuth credentials
   - Check environment variables loaded
   - Verify API endpoints are accessible

---

## 📊 Monitoring & Maintenance

### View Execution History:
1. n8n → "Executions" tab
2. See all workflow runs
3. Click any execution to see details
4. Debug failed runs

### Weekly Checklist:
- [ ] Monday: Verify workflow ran successfully
- [ ] Check BigQuery for new data
- [ ] Verify dashboard updated on GitHub
- [ ] Review Slack notification
- [ ] Check any failed nodes

### Monthly Maintenance:
- [ ] Review and refresh OAuth tokens if needed
- [ ] Check BigQuery storage costs
- [ ] Optimize queries if needed
- [ ] Update ICP scoring logic

---

## 🎨 Customization

### Change Schedule:
1. Click "Every Monday 9 AM" node
2. Modify cron expression:
   - `0 9 * * 1` = Monday 9 AM
   - `0 9 * * 2` = Tuesday 9 AM
   - `0 17 * * 5` = Friday 5 PM

### Add New Ad Platform:
1. Add new HTTP Request node
2. Configure API endpoint and auth
3. Add aggregation Code node
4. Connect to "Merge All Platforms"

### Customize Lead Routing:
1. Edit "Filter: ICP Score >= 70" node
2. Change threshold (e.g., >= 80 for Strategic only)
3. Add additional IF nodes for different segments

### Add More Integrations:
- Drag new nodes from left panel
- Configure API endpoints
- Connect to workflow
- Test and activate

---

## 📈 Expected Results

### After First Run:
- ✅ BigQuery has 1 week of ad data
- ✅ Dashboard shows updated metrics
- ✅ Slack notification received
- ✅ GitHub commit visible

### After 8 Weeks:
- ✅ BigQuery has full historical data
- ✅ Dashboard shows 8-week trends
- ✅ Attribution data accumulating
- ✅ Automated reports working

### Full System (Phase 4):
- ✅ Complete funnel visibility
- ✅ Lead enrichment automated
- ✅ Outreach sequences running
- ✅ Attribution model operational
- ✅ Weekly exec reports automated

---

## 🆘 Getting Help

### n8n Documentation:
- General: https://docs.n8n.io
- Nodes: https://docs.n8n.io/integrations/builtin/
- Credentials: https://docs.n8n.io/credentials/

### API Documentation:
- Google Ads: https://developers.google.com/google-ads/api/docs
- Reddit Ads: https://ads-api.reddit.com/docs
- LinkedIn Ads: https://learn.microsoft.com/en-us/linkedin/marketing/
- Clay: https://clay.com/docs
- Loops: https://loops.so/docs
- LaGrowthMachine: API docs in dashboard

### Common Issues:
- **Node shows "No data"**: Check previous node executed successfully
- **Authentication errors**: Re-authenticate in Credentials panel
- **Timeout errors**: Increase timeout in HTTP Request node settings
- **Rate limits**: Add delay nodes between API calls

---

## 🎯 Next Steps

1. **Import the workflow** into n8n
2. **Configure all credentials** (LinkedIn is the only new one needed)
3. **Test manually** by clicking "Execute Workflow"
4. **Activate** the weekly schedule
5. **Monitor first run** next Monday

Then we can build:
- Phase 2: Lead enrichment automation
- Phase 3: Outreach orchestration
- Phase 4: Complete attribution dashboard

---

## 💡 Quick Start (TL;DR)

```bash
# 1. Open n8n
open http://localhost:5678

# 2. Import workflow
# Click: Add Workflow → Import from File
# Select: n8n-workflows/complete-growth-engine.json

# 3. Add LinkedIn OAuth credential
# Settings → Credentials → Add → LinkedIn OAuth2 API
# Complete OAuth flow

# 4. Configure other credentials
# Select existing credentials for each node

# 5. Set environment variables
cat >> ~/.n8n/.env << 'EOF'
GCP_PROJECT_ID=your-project-id
CLAY_API_KEY=your-key
LOOPS_API_KEY=your-key
LGM_API_KEY=your-key
SLACK_WEBHOOK_URL=your-webhook
EOF

# 6. Restart n8n
pkill -f n8n && n8n start

# 7. Test workflow
# Click "Execute Workflow" in n8n UI

# 8. Activate
# Toggle "Inactive" → "Active"
```

You're done! The system will run automatically every Monday. 🎉
