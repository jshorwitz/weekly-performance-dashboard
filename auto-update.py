#!/usr/bin/env python3
"""
Automatically update the weekly performance dashboard with latest ad platform data.
Usage: python auto-update.py --week-ending 2025-10-26
"""
import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

def fetch_ad_data(start_date, end_date):
    """Run the fetch script and parse results."""
    print(f"🔄 Fetching ad platform data for {start_date} to {end_date}...")
    
    script_path = Path(__file__).parent.parent / "synter-media/apps/ppc-backend/fetch-all-platforms.py"
    venv_python = Path(__file__).parent.parent / "synter-media/apps/ppc-backend/venv/bin/python3"
    
    result = subprocess.run(
        [str(venv_python), str(script_path), "--start", start_date, "--end", end_date],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"❌ Error fetching data: {result.stderr}")
        return None
    
    # Parse the output to extract platform data
    output = result.stdout
    
    # Extract Google data
    google_match = re.search(r'Google: \$([0-9,]+\.\d+) spend, ([0-9,]+) impr, ([0-9,]+) clicks, ([0-9.]+) conv', output)
    
    if google_match:
        data = {
            'google': {
                'spend': float(google_match.group(1).replace(',', '')),
                'impressions': int(google_match.group(2).replace(',', '')),
                'clicks': int(google_match.group(3).replace(',', '')),
                'conversions': float(google_match.group(4))
            }
        }
        
        # Extract totals
        total_match = re.search(r'Total Spend: \$([0-9,]+\.\d+).*?Total Impressions: ([0-9,]+).*?Total Clicks: ([0-9,]+).*?Total Conversions: ([0-9,.]+)', output, re.DOTALL)
        if total_match:
            data['totals'] = {
                'spend': float(total_match.group(1).replace(',', '')),
                'impressions': int(total_match.group(2).replace(',', '')),
                'clicks': int(total_match.group(3).replace(',', '')),
                'conversions': float(total_match.group(4).replace(',', ''))
            }
        
        return data
    
    return None

def update_dashboard(week_label, data):
    """Update app.js with new week's data."""
    print(f"\n📝 Updating dashboard for week ending {week_label}...")
    
    app_js_path = Path(__file__).parent / "app.js"
    
    with open(app_js_path, 'r') as f:
        content = f.read()
    
    # Find the weeklyData object
    weeks_pattern = r"weeks: \[(.*?)\],"
    weeks_match = re.search(weeks_pattern, content)
    
    if not weeks_match:
        print("❌ Could not find weeks array in app.js")
        return False
    
    # Add new week
    weeks_str = weeks_match.group(1)
    new_weeks_str = weeks_str + f", '{week_label}'"
    content = content.replace(weeks_match.group(0), f"weeks: [{new_weeks_str}],")
    
    # Update each metric
    if data and 'totals' in data:
        totals = data['totals']
        google = data.get('google', {})
        
        # Helper function to add value to array
        def add_to_array(pattern_name, new_value):
            pattern = rf"{pattern_name}: \[(.*?)\]"
            match = re.search(pattern, content)
            if match:
                arr_str = match.group(1)
                new_arr_str = arr_str + f", {new_value}"
                return content.replace(match.group(0), f"{pattern_name}: [{new_arr_str}]")
            return content
        
        # Update total arrays
        content = add_to_array(r"'Spend'.*?total", round(totals['spend'], 2))
        content = add_to_array(r"'Impressions'.*?total", totals['impressions'])
        content = add_to_array(r"'Clicks'.*?total", totals['clicks'])
        content = add_to_array(r"'Conversions'.*?total", round(totals['conversions'], 1))
        
        print(f"  ✅ Added week {week_label}")
        print(f"  📊 Spend: ${totals['spend']:,.2f}")
        print(f"  📊 Impressions: {totals['impressions']:,}")
        print(f"  📊 Clicks: {totals['clicks']:,}")
        print(f"  📊 Conversions: {totals['conversions']:,.1f}")
    
    # Write back
    with open(app_js_path, 'w') as f:
        f.write(content)
    
    print(f"  ✅ Dashboard updated successfully!")
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--week-ending', required=True, help='Week ending date (YYYY-MM-DD)')
    args = parser.parse_args()
    
    week_end = datetime.strptime(args.week_ending, '%Y-%m-%d').date()
    week_start = week_end - timedelta(days=6)
    week_label = week_end.strftime('%-m/%-d')  # e.g., "10/26"
    
    print(f"\n{'='*80}")
    print(f"AUTO-UPDATING DASHBOARD FOR WEEK ENDING {week_label}")
    print(f"{'='*80}\n")
    
    # Fetch data
    data = fetch_ad_data(week_start.strftime('%Y-%m-%d'), week_end.strftime('%Y-%m-%d'))
    
    if not data:
        print("❌ Failed to fetch ad data")
        sys.exit(1)
    
    # Update dashboard
    if update_dashboard(week_label, data):
        print(f"\n✅ Dashboard auto-update complete!")
        print(f"\nNext steps:")
        print(f"  1. Test locally: cd ~/work/weekly-performance-dashboard && python3 -m http.server 8000")
        print(f"  2. Commit changes: git add app.js && git commit -m 'data: update for week ending {week_label}'")
        print(f"  3. Deploy: git push origin main")
    else:
        print(f"\n❌ Dashboard update failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
