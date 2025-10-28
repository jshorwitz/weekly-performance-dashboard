#!/usr/bin/env python3
"""
Simple script to update dashboard with new week's data.
Usage: python update-dashboard.py
"""
import re
from pathlib import Path

# REAL data from APIs (week 10/20-10/26)
NEW_WEEK = "10/26"
GOOGLE_DATA = {
    'spend': 26046.34,
    'impressions': 876783,
    'clicks': 15033,
    'conversions': 1733.2
}

# REAL data from APIs  
MICROSOFT_DATA = {'spend': 0.00, 'impressions': 0, 'clicks': 0, 'conversions': 0}  # Campaigns paused
REDDIT_DATA = {'spend': 3768.62, 'impressions': 727063, 'clicks': 2148, 'conversions': 7}  # Real API data
LINKEDIN_DATA = {'spend': 4232.96, 'impressions': 1378221, 'clicks': 1533, 'conversions': 691}  # Previous week (no token available)

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
    
    print(f"\n✅ Microsoft Ads (REAL DATA from API):")
    print(f"   Spend: ${MICROSOFT_DATA['spend']:,.2f} (campaigns paused this week)")
    
    print(f"\n✅ Reddit Ads (REAL DATA from API):")
    print(f"   Spend: ${REDDIT_DATA['spend']:,.2f}")
    print(f"   Impressions: {REDDIT_DATA['impressions']:,}")
    print(f"   Clicks: {REDDIT_DATA['clicks']:,}")
    print(f"   Conversions: {REDDIT_DATA['conversions']}")
    
    print(f"\n⚠️  LinkedIn Ads (using week 10/19 data - no active token):")
    
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
    
    # Update Microsoft and Reddit to $0 (campaigns paused week 10/26)
    microsoft_spend_pattern = r"('Microsoft': \[)([\d.,\s]+)(\])"
    matches = list(re.finditer(microsoft_spend_pattern, content))
    if matches:
        match = matches[0]  # First match is in Spend section
        values = [float(v.strip()) for v in match.group(2).split(',')]
        values[-1] = 0.00
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}", 1)
        print(f"✅ Updated Microsoft Spend to $0")
    
    reddit_spend_pattern = r"('Reddit': \[)([\d.,\s]+)(\])"
    matches = list(re.finditer(reddit_spend_pattern, content))
    if matches:
        match = matches[0]  # First match is in Spend section
        values = [float(v.strip()) for v in match.group(2).split(',')]
        values[-1] = round(REDDIT_DATA['spend'], 2)
        new_values = ', '.join(str(v) for v in values)
        content = content.replace(match.group(0), f"{match.group(1)}{new_values}{match.group(3)}", 1)
        print(f"✅ Updated Reddit Spend")
    
    # Update Reddit impressions (need to find in Impressions section)
    content_parts = content.split("'Impressions':")
    if len(content_parts) > 1:
        impr_section = content_parts[1]
        reddit_impr_match = re.search(r"('Reddit': \[)([\d.,\s]+)(\])", impr_section)
        if reddit_impr_match:
            values = [int(v.strip()) for v in reddit_impr_match.group(2).split(',')]
            values[-1] = REDDIT_DATA['impressions']
            new_values = ', '.join(str(v) for v in values)
            old_str = reddit_impr_match.group(0)
            new_str = f"{reddit_impr_match.group(1)}{new_values}{reddit_impr_match.group(3)}"
            content = content.replace(old_str, new_str, 1)
            print(f"✅ Updated Reddit Impressions")
    
    # Update Reddit clicks
    content_parts = content.split("'Clicks':")
    if len(content_parts) > 1:
        clicks_section = content_parts[1]
        reddit_clicks_match = re.search(r"('Reddit': \[)([\d.,\s]+)(\])", clicks_section)
        if reddit_clicks_match:
            values = [int(v.strip()) for v in reddit_clicks_match.group(2).split(',')]
            values[-1] = REDDIT_DATA['clicks']
            new_values = ', '.join(str(v) for v in values)
            old_str = reddit_clicks_match.group(0)
            new_str = f"{reddit_clicks_match.group(1)}{new_values}{reddit_clicks_match.group(3)}"
            content = content.replace(old_str, new_str, 1)
            print(f"✅ Updated Reddit Clicks")
    
    # Update Reddit conversions
    content_parts = content.split("'Conversions':")
    if len(content_parts) > 1:
        conv_section = content_parts[1]
        reddit_conv_match = re.search(r"('Reddit': \[)([\d.,\s]+)(\])", conv_section)
        if reddit_conv_match:
            values = [float(v.strip()) for v in reddit_conv_match.group(2).split(',')]
            values[-1] = REDDIT_DATA['conversions']
            new_values = ', '.join(str(v) for v in values)
            old_str = reddit_conv_match.group(0)
            new_str = f"{reddit_conv_match.group(1)}{new_values}{reddit_conv_match.group(3)}"
            content = content.replace(old_str, new_str, 1)
            print(f"✅ Updated Reddit Conversions")
    
    # Save
    with open(app_js, 'w') as f:
        f.write(content)
    
    print(f"\n✅ Dashboard updated successfully!")
    print(f"\nℹ️  Note: Microsoft, Reddit, and LinkedIn still show week 10/19 data")
    print(f"   These will update automatically once their API integrations are complete")

if __name__ == "__main__":
    main()
