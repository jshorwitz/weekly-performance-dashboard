# Weekly Dashboard Update Guide

## Quick Update Process

### 1. Pull Latest Changes
```bash
cd ~/work/weekly-performance-dashboard
git pull origin main
```

### 2. Update Data in app.js

Open `app.js` and locate the `weeklyData` object (lines 43-99).

**Add a new week to each array:**

```javascript
const weeklyData = {
    weeks: ['9/7', '9/14', '9/21', '9/28', '10/5', '10/12', '10/19', '10/26', 'NEW_WEEK'],
    categories: {
        'Spend': {
            icon: '💰',
            total: [...existing values..., NEW_VALUE],
            channels: {
                'Google': [...existing values..., NEW_VALUE],
                'Microsoft': [...existing values..., NEW_VALUE],
                'Reddit': [...existing values..., NEW_VALUE],
                'Linkedin': [...existing values..., NEW_VALUE],
                'Stackadapt': [...existing values..., NEW_VALUE]
            }
        },
        // ... repeat for Impressions, Clicks, Conversions
        'AIQLs': {
            icon: '🎯',
            total: [...existing values..., NEW_VALUE]
        },
        'Hand Raisers': {
            icon: '✋',
            total: [...existing values..., NEW_VALUE]
        }
    }
};
```

**Important:** 
- The **last value** in each array is the current week (displayed in KPIs and pie chart)
- Keep all arrays the same length
- Use `null` for missing data (e.g., AIQLs in early weeks)

### 3. Update Week Ending Date in index.html

Open `index.html` and update line 36:
```html
<div class="header-subtitle">Tactical Dashboard · Week Ending OCT 26, 2025</div>
```

### 4. Test Locally
```bash
python3 -m http.server 8000
```
Open http://localhost:8000 and verify:
- ✅ KPIs show correct current week values
- ✅ Charts display properly
- ✅ Accordion tables have new week column
- ✅ Deltas calculate correctly

Press `Ctrl+C` to stop the server.

### 5. Deploy to Vercel
```bash
git add app.js index.html
git commit -m "data: update dashboard for week ending [DATE]"
git push origin main
```

Vercel will auto-deploy in ~30 seconds.

---

## Data Template for New Week

When adding week `11/2`:

1. **Weeks array:** Add `'11/2'` to the end
2. **Each metric total:** Add the new total value
3. **Each channel:** Add the new channel value for that metric

### Metrics to Update:
- [ ] Spend (Total + 5 channels: Google, Microsoft, Reddit, Linkedin, Stackadapt)
- [ ] Impressions (Total + 5 channels)
- [ ] Clicks (Total + 5 channels)
- [ ] Conversions (Total + 5 channels)
- [ ] AIQLs (Total only)
- [ ] Hand Raisers (Total only)

---

## Troubleshooting

**Dashboard shows old data:**
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear cache and reload

**Charts not showing:**
- Check browser console for errors (F12)
- Verify all arrays have same length
- Ensure no syntax errors (missing commas, brackets)

**Wrong week displayed:**
- The dashboard shows the **last value** in each array
- Verify you added new values to the **end** of arrays

---

## Quick Reference: File Locations

- **Data:** `app.js` lines 43-99
- **Week date in header:** `index.html` line 36
- **AIQL breakdown (static):** `index.html` lines 62-128
