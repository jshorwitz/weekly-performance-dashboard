# Dashboard Automation Guide

## ✅ What's Automated

The weekly performance dashboard now automatically:
1. **Fetches Google Ads data** via API (real-time)
2. **Updates the dashboard** with latest metrics
3. **Commits and deploys** to Vercel

## 🚀 Quick Start

### Manual Weekly Update (Recommended for now)
```bash
cd ~/work/weekly-performance-dashboard
./weekly-update.sh
```

This will:
- Fetch latest Google Ads data from API
- Update app.js with new week's metrics
- Prompt you to commit and push
- Auto-deploy to Vercel

### Specify a Specific Week
```bash
./weekly-update.sh 2025-11-02  # Updates for week ending Nov 2
```

## 📊 Current Data Sources

### ✅ Automated (Real API Data)
- **Google Ads**: Live data from Google Ads API
  - Script: `~/work/synter-media/apps/ppc-backend/fetch-week.py`
  - Metrics: Spend, Impressions, Clicks, Conversions

### ⚠️ Pending Integration
- **Microsoft Ads**: API exists but not connected yet
- **Reddit Ads**: API exists but not connected yet  
- **LinkedIn Ads**: API exists but not connected yet
- **AIQLs**: Need to connect to PostHog/database
- **Hand Raisers**: Need to connect to PostHog/database

Currently using previous week's data for these platforms until APIs are integrated.

## 🔧 Setup for Full Automation

### Option 1: Weekly Cron Job (MacOS)

Create a cron job to run every Monday morning:

```bash
# Edit crontab
crontab -e

# Add this line (runs every Monday at 9 AM)
0 9 * * 1 cd ~/work/weekly-performance-dashboard && ./weekly-update.sh >> ~/weekly-dashboard-update.log 2>&1
```

### Option 2: GitHub Actions (Cloud-based)

Create `.github/workflows/weekly-update.yml`:
```yaml
name: Weekly Dashboard Update
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install google-ads python-dotenv
      - name: Update dashboard
        env:
          GOOGLE_ADS_DEVELOPER_TOKEN: ${{ secrets.GOOGLE_ADS_DEVELOPER_TOKEN }}
          GOOGLE_ADS_CLIENT_ID: ${{ secrets.GOOGLE_ADS_CLIENT_ID }}
          # ... other secrets
        run: python3 update-dashboard.py
      - name: Commit and push
        run: |
          git config user.name "Dashboard Bot"
          git config user.email "bot@example.com"
          git add app.js
          git commit -m "data: weekly update $(date +%Y-%m-%d)" || exit 0
          git push
```

## 📁 File Structure

```
weekly-performance-dashboard/
├── app.js                    # Dashboard data (auto-updated)
├── update-dashboard.py       # Main update script
├── weekly-update.sh          # Wrapper script with git workflow
├── fetch-ad-data.py          # Manual data entry template
├── update-from-database.py   # Query synter-media database
└── AUTOMATION.md             # This file

~/work/synter-media/apps/ppc-backend/
├── fetch-week.py             # Google Ads API fetcher
├── fetch-all-platforms.py    # Multi-platform fetcher (WIP)
└── database.py               # Database connection
```

## 🔐 Required Credentials

Stored in `~/work/synter-media/.env.local`:
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID`

## 🎯 Next Steps to Complete Automation

1. **Integrate Microsoft Ads API**
   - Use existing script: `~/work/synter-media/agents/ingestor_microsoft_ads.py`
   - Add to `fetch-all-platforms.py`

2. **Integrate Reddit Ads API**
   - Use existing provider: `~/work/synter-media/apps/ppc-backend/ads/providers/reddit.py`
   - Add to `fetch-all-platforms.py`

3. **Integrate LinkedIn Ads API**
   - Use existing provider: `~/work/synter-media/apps/ppc-backend/ads/providers/linkedin.py`
   - Add to `fetch-all-platforms.py`

4. **Add AIQLs & Hand Raisers Tracking**
   - Query PostHog API for weekly counts
   - Or query synter-media database

5. **Set up Cron Job**
   - Choose Option 1 (local) or Option 2 (GitHub Actions)

## 🐛 Troubleshooting

### Google Ads API Error
```bash
# Test connection
cd ~/work/synter-media/apps/ppc-backend
source venv/bin/activate
python3 fetch-week.py
```

### Dashboard Not Updating
```bash
# Check git status
cd ~/work/weekly-performance-dashboard
git status
git diff app.js

# Manual update
python3 update-dashboard.py
```

### Vercel Deployment Not Triggering
```bash
# Check deployment status
vercel ls

# Force redeploy
git commit --allow-empty -m "trigger deploy"
git push origin main
```

## 📞 Support

- Dashboard repo: https://github.com/jshorwitz/weekly-performance-dashboard
- Issues: Create an issue on GitHub
- Quick test: Run `./weekly-update.sh` and check output
