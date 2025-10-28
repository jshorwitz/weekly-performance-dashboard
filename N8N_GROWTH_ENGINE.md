# n8n Growth Engine - Complete Automation

This guide sets up a comprehensive growth data pipeline using n8n to unify all your ad platforms, lead enrichment, outreach tools, and analytics.

## 🎯 Architecture Overview

**Data Flow:**
1. **Ad Platforms** → n8n → BigQuery (weekly metrics)
2. **Leads (PostHog/HubSpot)** → Clay → n8n → BigQuery (enrichment)
3. **Outreach (Loops/LGM)** → n8n → BigQuery (engagement tracking)
4. **BigQuery** → n8n → Dashboard (weekly auto-update)

## 📋 Workflows to Build

### 1. Weekly Ad Data Sync (Primary)
**Frequency:** Weekly (Monday 9 AM)  
**Duration:** ~5 minutes

**Steps:**
1. Trigger: Schedule (every Monday)
2. Fetch Google Ads (last 7 days)
3. Fetch Microsoft Ads (last 7 days)
4. Fetch Reddit Ads (last 7 days)
5. Fetch LinkedIn Ads (last 7 days)
6. Aggregate metrics by platform
7. Insert into BigQuery `ad_metrics` table
8. Update dashboard app.js via GitHub API
9. Send Slack notification with summary

**Credentials Needed:**
- Google Ads OAuth
- Microsoft Ads OAuth
- Reddit Ads OAuth
- LinkedIn Ads OAuth
- BigQuery Service Account
- GitHub Personal Access Token

---

### 2. Lead Processing & Enrichment
**Frequency:** Hourly  
**Duration:** ~2-10 minutes

**Steps:**
1. Trigger: Webhook from PostHog (new signup) OR Schedule (hourly)
2. Query PostHog for new signups (last hour)
3. Query HubSpot for new contacts
4. Send to Clay for enrichment:
   - Company data
   - Tech stack
   - Employee count
   - LinkedIn profiles
5. Store enriched data in BigQuery `leads` table
6. If qualified → Send to Loops list
7. If ICP match → Send to LaGrowthMachine campaign

**Credentials Needed:**
- PostHog API Key
- HubSpot API Key
- Clay API Key
- Loops API Key
- LaGrowthMachine API Key
- BigQuery Service Account

---

### 3. Outreach Tracking & Attribution
**Frequency:** Daily (8 AM)  
**Duration:** ~3 minutes

**Steps:**
1. Trigger: Schedule (daily)
2. Fetch Loops campaign stats (last 24h)
3. Fetch LaGrowthMachine campaign stats (last 24h)
4. Match with leads in BigQuery
5. Update lead engagement scores
6. Track: opens, clicks, replies, meetings booked
7. Send summary to Slack

---

### 4. Dashboard Auto-Update
**Frequency:** Weekly (Monday 10 AM)  
**Duration:** ~1 minute

**Steps:**
1. Trigger: Schedule (after ad data sync completes)
2. Query BigQuery for last 8 weeks aggregated metrics
3. Format data for dashboard
4. Update app.js via GitHub API
5. Trigger Vercel deployment
6. Send confirmation to Slack

---

## 🚀 Setup Instructions

### Step 1: Start n8n

```bash
n8n start
```

Open: http://localhost:5678

### Step 2: Set Up Credentials in n8n

**Google Ads:**
1. Settings → Credentials → Add Credential
2. Type: Google Ads OAuth2 API
3. Use existing tokens from `~/work/synter-media/.env.local`

**Microsoft Ads:**
1. Type: Microsoft Graph OAuth2 API  
2. Use tokens from `~/work/client-tools/ad-management/.microsoft_ads_tokens.json`

**Reddit Ads:**
1. Type: OAuth2 API (Custom)
2. Authorization URL: `https://www.reddit.com/api/v1/authorize`
3. Access Token URL: `https://www.reddit.com/api/v1/access_token`
4. Use tokens from `~/work/client-tools/ad-management/.reddit_ads_tokens.json`

**LinkedIn Ads:**
1. Type: LinkedIn OAuth2 API
2. Scopes: `r_ads_reporting`, `r_ads`
3. Complete OAuth flow in n8n

**BigQuery:**
1. Type: Google Cloud Service Account
2. Create service account in Google Cloud Console
3. Download JSON key
4. Upload to n8n

**Clay:**
1. Type: Header Auth
2. Get API key from Clay dashboard

**Loops:**
1. Type: Header Auth
2. Get API key from Loops.so settings

**LaGrowthMachine:**
1. Type: API Key Auth
2. Get from LGM dashboard

---

## 📊 BigQuery Schema

Create these tables in BigQuery:

```sql
-- Ad performance metrics (weekly aggregated)
CREATE TABLE growth_data.ad_metrics (
  week_ending DATE,
  platform STRING,
  spend FLOAT64,
  impressions INT64,
  clicks INT64,
  conversions FLOAT64,
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- Lead tracking
CREATE TABLE growth_data.leads (
  id STRING,
  email STRING,
  created_at TIMESTAMP,
  source STRING,
  utm_source STRING,
  utm_campaign STRING,
  utm_medium STRING,
  enriched_at TIMESTAMP,
  company_name STRING,
  company_size STRING,
  tech_stack ARRAY<STRING>,
  icp_score FLOAT64,
  lead_status STRING
);

-- Enrichment data from Clay
CREATE TABLE growth_data.enrichment (
  lead_id STRING,
  enriched_at TIMESTAMP,
  company_domain STRING,
  employee_count INT64,
  tech_stack STRING,
  linkedin_url STRING,
  industry STRING,
  clay_data JSON
);

-- Outreach tracking
CREATE TABLE growth_data.outreach (
  lead_id STRING,
  campaign_name STRING,
  platform STRING, -- 'loops' or 'lgm'
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  replied_at TIMESTAMP,
  meeting_booked BOOL,
  status STRING
);

-- Conversion events
CREATE TABLE growth_data.conversions (
  conversion_id STRING,
  lead_id STRING,
  conversion_type STRING, -- 'aiql', 'hand_raiser', 'demo_booked'
  conversion_date DATE,
  source_platform STRING,
  source_campaign STRING,
  value FLOAT64
);
```

---

## 🔨 Building the Workflows

### Quick Start: Import Workflow Templates

I'll create JSON workflow files you can import directly into n8n:

1. `n8n-ad-platforms-sync.json` - Weekly ad data collection
2. `n8n-lead-enrichment.json` - Hourly lead processing
3. `n8n-outreach-tracking.json` - Daily engagement tracking
4. `n8n-dashboard-update.json` - Weekly dashboard refresh

---

## 🎨 Recommended Approach

**Phase 1 (Today):** 
- Build Ad Platforms Sync workflow
- Set up BigQuery tables
- Test LinkedIn Ads connection in n8n
- Get one complete weekly data pull working

**Phase 2 (This Week):**
- Build Lead Enrichment pipeline
- Connect Clay API
- Set up Loops/LGM webhooks

**Phase 3 (Next Week):**
- Build attribution model
- Create executive dashboard
- Set up automated reporting

---

## 💡 Benefits of n8n Approach

✅ **Visual debugging** - See data flow in real-time  
✅ **Built-in OAuth** - No token management code  
✅ **Error handling** - Retry logic and notifications  
✅ **Scheduling** - Cron built-in  
✅ **Webhooks** - Real-time triggers from platforms  
✅ **Version control** - Export workflows as JSON  
✅ **Self-hosted** - Your data stays local  

---

Ready to start building? I'll create the first workflow for ad platforms data collection.
