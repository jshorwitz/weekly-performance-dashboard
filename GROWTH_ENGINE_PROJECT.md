# Growth Engine Automation - Project Plan

## 🎯 Vision

Build a unified, automated growth intelligence system that tracks the entire customer journey from ad impression to customer, using n8n as the orchestration layer.

## 📊 Current State (Completed Today)

✅ **Dashboard**: Working with real-time ad platform data  
✅ **Google Ads API**: Fully integrated  
✅ **Microsoft Ads API**: Integrated (currently paused campaigns)  
✅ **Reddit Ads API**: Fully integrated  
✅ **Chart fixes**: Text contrast and growth rates working  
✅ **Auto-deploy**: Git push → Vercel deployment  

## 🚀 Phase 1: Ad Platforms Consolidation (Week 1)

**Goal:** Single source of truth for all ad spend and performance

### Tasks:
- [x] Google Ads integration
- [x] Microsoft Ads integration  
- [x] Reddit Ads integration
- [ ] LinkedIn Ads OAuth in n8n
- [ ] BigQuery ad_metrics table
- [ ] n8n workflow: Weekly Ad Data Sync
- [ ] Test end-to-end weekly automation

### Deliverables:
1. n8n workflow running weekly
2. BigQuery table with 8+ weeks of historical data
3. Dashboard auto-updates from BigQuery
4. Slack notifications on completion

**Effort:** 4-6 hours  
**Timeline:** This week

---

## 🎯 Phase 2: Lead Intelligence Pipeline (Week 2)

**Goal:** Automated lead enrichment and qualification

### Data Sources:
- PostHog (signups, page visits, engagement)
- HubSpot (CRM contacts)
- Google Ads (AIQL conversions)
- Direct form submissions

### Processing:
- Clay enrichment (company data, tech stack, firmographics)
- ICP scoring (Strategic/Enterprise/SMB/Self-Service)
- Lead routing (Sales/Marketing/Automation)

### Tasks:
- [ ] PostHog webhook → n8n
- [ ] HubSpot API integration
- [ ] Clay API integration
- [ ] BigQuery leads table schema
- [ ] n8n workflow: Hourly Lead Processing
- [ ] ICP scoring logic
- [ ] Lead routing automation

### Deliverables:
1. Automated lead enrichment (hourly)
2. ICP scores in BigQuery
3. Qualified leads → Loops + LGM
4. Dashboard shows AIQLs and Hand Raisers from BigQuery

**Effort:** 8-12 hours  
**Timeline:** Week 2

---

## 📧 Phase 3: Outreach Orchestration (Week 3)

**Goal:** Automated nurture and attribution tracking

### Integrations:
- Loops.so (email campaigns)
- LaGrowthMachine (LinkedIn + email sequences)
- PostHog (conversion tracking)

### Workflows:
1. **New Lead → Nurture Sequence**
   - Qualified lead enters Loops list
   - Personalized email sequence starts
   - Track opens, clicks, replies

2. **ICP Match → Outbound Sequence**
   - Strategic/Enterprise leads → LGM
   - Multi-touch sequence (email + LinkedIn)
   - Meeting booking automation

3. **Attribution Tracking**
   - Link ad clicks → leads → outreach → conversions
   - Multi-touch attribution model
   - Cost per AIQL, cost per opportunity

### Tasks:
- [ ] Loops API integration
- [ ] LaGrowthMachine API integration
- [ ] BigQuery outreach table
- [ ] n8n workflow: Lead Routing
- [ ] n8n workflow: Engagement Tracking
- [ ] Attribution model in BigQuery

### Deliverables:
1. Automated lead routing based on ICP score
2. Full engagement tracking
3. Attribution dashboard
4. Weekly performance reports

**Effort:** 10-15 hours  
**Timeline:** Week 3

---

## 📈 Phase 4: Growth Intelligence Dashboard (Week 4)

**Goal:** Executive dashboard with full funnel visibility

### Metrics to Track:

**Top-of-Funnel:**
- Ad spend by platform
- Impressions, clicks, CTR
- Cost per click
- Landing page visits

**Middle-of-Funnel:**
- Signups (total, by source)
- AIQLs (account-matched leads)
- Hand raisers (intent signals)
- Enrichment completion rate

**Bottom-of-Funnel:**
- Demos booked
- Opportunities created
- Pipeline value
- Closed-won revenue

**Attribution:**
- First-touch attribution
- Last-touch attribution
- Multi-touch attribution
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

### Tasks:
- [ ] BigQuery views for funnel metrics
- [ ] Enhanced dashboard with funnel stages
- [ ] Cohort analysis
- [ ] CAC/LTV calculations
- [ ] Weekly automated reports

### Deliverables:
1. Complete funnel dashboard
2. Attribution model
3. Weekly executive reports
4. Automated Slack summaries

**Effort:** 12-18 hours  
**Timeline:** Week 4

---

## 🛠️ Technical Stack

**Orchestration:** n8n (self-hosted)  
**Data Warehouse:** BigQuery  
**Ad Platforms:** Google, Microsoft, Reddit, LinkedIn  
**Enrichment:** Clay  
**Email:** Loops  
**Outreach:** LaGrowthMachine  
**Analytics:** PostHog  
**CRM:** HubSpot  
**Dashboard:** Vercel + GitHub  
**Notifications:** Slack  

---

## 💰 Estimated Costs

**n8n:** Self-hosted (free)  
**BigQuery:** ~$10-50/month (query costs)  
**Clay:** $349/month (current plan)  
**Loops:** $X/month  
**LaGrowthMachine:** $X/month  
**PostHog:** Cloud plan  
**Total New Costs:** Minimal (mostly existing tools)

---

## 🎯 Success Metrics

**Week 1:**
- ✅ All ad platforms auto-updating weekly
- ✅ Dashboard shows real-time data
- ✅ Zero manual data entry

**Week 2:**
- ✅ Lead enrichment automated
- ✅ ICP scores calculated automatically
- ✅ Qualified leads routed to outreach

**Week 3:**
- ✅ Outreach campaigns automated
- ✅ Engagement tracked end-to-end
- ✅ Attribution model working

**Week 4:**
- ✅ Complete funnel visibility
- ✅ Weekly exec reports automated
- ✅ CAC/LTV tracking operational

---

## 📞 Getting Started

```bash
# 1. Start n8n
n8n start

# 2. Run setup script
cd ~/work/weekly-performance-dashboard
./setup-n8n-workflows.sh

# 3. Import first workflow
# Open http://localhost:5678
# Import: n8n-workflows/01-ad-platforms-weekly-sync.json

# 4. Configure credentials and test
```

See [N8N_GROWTH_ENGINE.md](N8N_GROWTH_ENGINE.md) for detailed setup instructions.

---

## 🤔 Questions to Answer

Before Phase 2:
1. Which Clay tables are you using for enrichment?
2. What's your current Loops setup? (lists, campaigns)
3. LaGrowthMachine campaign structure?
4. PostHog event names for conversions?
5. HubSpot lead lifecycle stages?

Let's tackle Phase 1 first, then iterate!
