# n8n Growth Engine - Quick Start

## ⚡ 5-Minute Setup

### 1. Open n8n
```bash
open http://localhost:5678
```

### 2. Import Workflow
- Click "Add Workflow" → "..." → "Import from File"
- Select: `n8n-workflows/complete-growth-engine.json`

### 3. Add LinkedIn OAuth (Only New Credential)
- Settings → Credentials → Add Credential
- Type: "LinkedIn OAuth2 API"
- Click "Connect my account"
- Sign in and authorize
- ✅ Done!

### 4. Set API Keys
Create `~/.n8n/.env`:
```bash
# Google Cloud
GCP_PROJECT_ID=your-gcp-project

# Clay
CLAY_API_KEY=your-clay-key

# Loops  
LOOPS_API_KEY=your-loops-key

# LaGrowthMachine
LGM_API_KEY=your-lgm-key
LGM_CAMPAIGN_ID=your-campaign-id

# Slack (optional)
SLACK_WEBHOOK_URL=your-webhook
```

Restart n8n:
```bash
pkill -f n8n && n8n start
```

### 5. Create BigQuery Tables

Run this SQL in BigQuery console:

```sql
CREATE SCHEMA IF NOT EXISTS growth_data;

CREATE TABLE growth_data.ad_metrics (
  week_ending DATE,
  platform STRING,
  spend FLOAT64,
  impressions INT64,
  clicks INT64,
  conversions FLOAT64,
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);
```

### 6. Test Workflow
- Click "Execute Workflow" in n8n
- Watch nodes turn green
- Check BigQuery for data
- Verify dashboard updated

### 7. Activate
- Toggle "Inactive" → "Active"
- ✅ Done! Runs every Monday at 9 AM

---

## 📊 What You Get

**Automated Weekly:**
- ✅ All ad platform data collected
- ✅ Stored in BigQuery
- ✅ Dashboard auto-updated
- ✅ Slack notification sent

**Automated Hourly:**
- ✅ New leads enriched via Clay
- ✅ Qualified leads → Loops email
- ✅ ICP matches → LGM outreach
- ✅ Full attribution tracking

---

## 🔧 Credentials Already Working

You already have:
- ✅ Google Ads OAuth (configured)
- ✅ Reddit Ads tokens (refreshed today)
- ✅ Microsoft Ads tokens (ready)
- ✅ PostHog API key (in .env)

Only need:
- [ ] LinkedIn Ads OAuth (5 minutes in n8n)
- [ ] BigQuery service account (one-time setup)
- [ ] Clay/Loops/LGM API keys (copy from dashboards)

---

## 📖 Full Documentation

- **Complete setup**: [N8N_COMPLETE_SETUP.md](N8N_COMPLETE_SETUP.md)
- **Project roadmap**: [GROWTH_ENGINE_PROJECT.md](GROWTH_ENGINE_PROJECT.md)  
- **Architecture**: [N8N_GROWTH_ENGINE.md](N8N_GROWTH_ENGINE.md)

---

## ✅ Current Status

- [x] Dashboard working with real ad data
- [x] Google, Microsoft, Reddit APIs integrated
- [x] n8n workflow created (17 nodes, full automation)
- [x] Documentation complete
- [ ] Import into n8n (you do this)
- [ ] LinkedIn OAuth setup (5 min)
- [ ] BigQuery tables created (5 min)
- [ ] Test and activate (2 min)

**Total time to complete:** ~15 minutes

**Result:** Fully automated growth engine running weekly!
