# Weekly Performance Dashboard

Password-protected weekly advertising performance dashboard using the Synter tactical design system.

## 🚀 Quick Deploy to Vercel

1. **Push to GitHub:**
```bash
cd /Users/joelhorwitz/work/weekly-performance-dashboard
git init
git add .
git commit -m "Initial commit: Weekly performance dashboard"
gh repo create weekly-performance-dashboard --public --source=. --remote=origin --push
```

2. **Deploy to Vercel:**
- Go to https://vercel.com/new
- Import your GitHub repository
- Click "Deploy"
- Done! Your dashboard will be live at `https://your-project.vercel.app`

## 🔐 Security

**Default Password:** `growth2025`

To change the password, edit `app.js` line 2:
```javascript
const PASSWORD = 'your-new-password';
```

## 📊 Features

- ✅ Password protected
- ✅ Synter tactical/cyberpunk design system
- ✅ Responsive (mobile-friendly)
- ✅ Session-based auth
- ✅ Clean, fast, static site
- ✅ No backend required

## 🎨 Design System

Uses the Synter tactical design system:
- Dark carbon backgrounds
- Monospace fonts (IBM Plex Mono)
- Tactical accent colors
- Command center aesthetic

## 🔄 Updating Data

To update the weekly data, edit the `csvData` variable in `app.js` (around line 38).

## 📱 Local Development

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js
npx http-server -p 8080

# Then open: http://localhost:8080
```

## 🌐 Live URL

After deploying to Vercel, you'll get a URL like:
`https://weekly-performance-dashboard.vercel.app`

Share this internally - password required for access.

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript
- No framework required
- No build step
- Instant deployment

## 📝 License

Internal use only
