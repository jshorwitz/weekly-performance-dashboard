#!/usr/bin/env python3
"""
Simple script to update dashboard with new week's data.
Usage: python update-dashboard.py
"""
import re
from pathlib import Path

# Real data from Google Ads API (fetched earlier)
NEW_WEEK = "10/26"
GOOGLE_DATA = {
    'spend': 26046.34,
    'impressions': 876783,
    'clicks': 15033,
    'conversions': 1733.2
}

# Placeholder data for other platforms (using week 10/19 values)
# TODO: Replace with real API calls when other platforms are integrated
MICROSOFT_DATA = {'spend': 17109.03, 'impressions': 135383, 'clicks': 2454, 'conversions': 292}
REDDIT_DATA = {'spend': 3143.38, 'impressions': 383818, 'clicks': 1776, 'conversions': 1183}
LINKEDIN_DATA = {'spend': 4232.96, 'impressions': 1378221, 'clicks': 1533, 'conversions': 691}

# Calculate totals
TOTALS = {
    'spend': GOOGLE_DATA['spend'] + MICROSOFT_DATA['spend'] + REDDIT_DATA['spend'] + LINKEDIN_DATA['spend'],
    'impressions': GOOGLE_DATA['impressions'] + MICROSOFT_DATA['impressions'] + REDDIT_DATA['impressions'] + LINKEDIN_DATA['impressions'],
    'clicks': GOOGLE_DATA['clicks'] + MICROSOFT_DATA['clicks'] + REDDIT_DATA['clicks'] + LINKEDIN_DATA['clicks'],
    'conversions': GOOGLE_DATA['conversions'] + MICROSOFT_DATA['conversions'] + REDDIT_DATA['conversions'] + LINKEDIN_DATA['conversions']
}

def main():
    app_js = Path(__file__).parent / "app.js"
    
    print(f"\n📝 Updating dashboard with week {NEW_WEEK} data...")
    print(f"\n✅ Google Ads (REAL DATA from API):")
    print(f"   Spend: ${GOOGLE_DATA['spend']:,.2f}")
    print(f"   Impressions: {GOOGLE_DATA['impressions']:,}")
    print(f"   Clicks: {GOOGLE_DATA['clicks']:,}")
    print(f"   Conversions: {GOOGLE_DATA['conversions']:,.1f}")
    
    print(f"\n⚠️  Other platforms (using week 10/19 placeholder data):")
    print(f"   Microsoft, Reddit, LinkedIn - will be real when APIs integrated")
    
    print(f"\n📊 WEEK TOTALS:")
    print(f"   Spend: ${TOTALS['spend']:,.2f}")
    print(f"   Impressions: {TOTALS['impressions']:,}")
    print(f"   Clicks: {TOTALS['clicks']:,}")
    print(f"   Conversions: {TOTALS['conversions']:,.1f}")
    
    with open(app_js, 'r') as f:
        content = f.read()
    
    # Update weeks array - change last value from '10/26' to '10/26' (it's already there)
    # The issue is that 10/26 currently has duplicate 10/19 data, so we'll update the values
    
    # Find and update Spend total array (last value)
    spend_total_pattern = r"('Spend':.*?total: \[)([\d.,\s]+)(\])"
    match = re.search(spend_total_pattern, content, re.DOTALL)
    if match:
        values = [float(v.strip()) for v in match.group(2).split(',')]
        values[-1] = round(TOTALS['spend'], 2)
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}")
        print(f"\n✅ Updated Spend total")
    
    # Update Impressions total
    impr_pattern = r"('Impressions':.*?total: \[)([\d.,\s]+)(\])"
    match = re.search(impr_pattern, content, re.DOTALL)
    if match:
        values = [int(v.strip()) for v in match.group(2).split(',')]
        values[-1] = TOTALS['impressions']
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}")
        print(f"✅ Updated Impressions total")
    
    # Update Clicks total
    clicks_pattern = r"('Clicks':.*?total: \[)([\d.,\s]+)(\])"
    match = re.search(clicks_pattern, content, re.DOTALL)
    if match:
        values = [int(v.strip()) for v in match.group(2).split(',')]
        values[-1] = TOTALS['clicks']
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}")
        print(f"✅ Updated Clicks total")
    
    # Update Conversions total
    conv_pattern = r"('Conversions':.*?total: \[)([\d.,\s]+)(\])"
    match = re.search(conv_pattern, content, re.DOTALL)
    if match:
        values = [float(v.strip()) for v in match.group(2).split(',')]
        values[-1] = round(TOTALS['conversions'], 1)
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}")
        print(f"✅ Updated Conversions total")
    
    # Update Google channel data (last value in each Google array)
    # Spend
    google_spend_pattern = r"('Google': \[)([\d.,\s]+)(\])"
    matches = list(re.finditer(google_spend_pattern, content))
    if matches:
        match = matches[0]  # First match is in Spend section
        values = [float(v.strip()) for v in match.group(2).split(',')]
        values[-1] = round(GOOGLE_DATA['spend'], 2)
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}", 1)
        print(f"✅ Updated Google Spend")
    
    # Save
    with open(app_js, 'w') as f:
        f.write(content)
    
    print(f"\n✅ Dashboard updated successfully!")
    print(f"\nℹ️  Note: Microsoft, Reddit, and LinkedIn still show week 10/19 data")
    print(f"   These will update automatically once their API integrations are complete")

if __name__ == "__main__":
    main()
