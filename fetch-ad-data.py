#!/usr/bin/env python3
"""
Fetch ad performance data from all platforms for weekly dashboard update.
Usage: python fetch-ad-data.py --week-start 2025-10-20 --week-end 2025-10-26
"""

import argparse
import json
import sys
from datetime import datetime, timedelta

def main():
    parser = argparse.ArgumentParser(description='Fetch ad platform data for weekly dashboard')
    parser.add_argument('--week-start', help='Week start date (YYYY-MM-DD)', required=False)
    parser.add_argument('--week-end', help='Week end date (YYYY-MM-DD)', required=False)
    args = parser.parse_args()
    
    # Default to last week if not specified
    if not args.week_end:
        # Get last Saturday
        today = datetime.now().date()
        days_since_saturday = (today.weekday() + 2) % 7
        last_saturday = today - timedelta(days=days_since_saturday)
        week_end = last_saturday
    else:
        week_end = datetime.strptime(args.week_end, '%Y-%m-%d').date()
    
    if not args.week_start:
        week_start = week_end - timedelta(days=6)
    else:
        week_start = datetime.strptime(args.week_start, '%Y-%m-%d').date()
    
    print(f"📅 Fetching data for week: {week_start.strftime('%m/%d')} - {week_end.strftime('%m/%d')}")
    print(f"    ({week_start} to {week_end})\n")
    
    # TODO: Integrate with existing scripts in synter-media
    print("⚠️  This script needs to be integrated with your existing ad platform APIs.")
    print("    Found the following scripts that can be used:")
    print("    - Google Ads: ~/ad-platforms-cli/google-ads-fetch.py")
    print("    - Microsoft Ads: ~/work/synter-media/agents/ingestor_microsoft_ads.py")
    print("    - LinkedIn Ads: ~/work/synter-media/apps/ppc-backend/ads/providers/linkedin.py")
    print("    - Reddit Ads: ~/work/synter-media/apps/ppc-backend/ads/providers/reddit.py")
    print("\n📝 For now, please provide the data manually or share where the aggregated")
    print("    weekly reports are stored so I can pull from there.\n")
    
    # Print template for manual entry
    print("=" * 80)
    print("MANUAL DATA ENTRY TEMPLATE")
    print("=" * 80)
    print(f"""
Week: {week_end.strftime('%m/%d')}

Spend by Channel:
- Google: $
- Microsoft: $
- Reddit: $
- LinkedIn: $
- Stackadapt: $
TOTAL: $

Impressions by Channel:
- Google: 
- Microsoft: 
- Reddit: 
- LinkedIn: 
- StackAdapt: 
TOTAL: 

Clicks by Channel:
- Google: 
- Microsoft: 
- Reddit: 
- LinkedIn: 
- StackAdapt: 
TOTAL: 

Conversions by Channel:
- Google: 
- Microsoft: 
- Reddit: 
- LinkedIn: 
- StackAdapt: 
TOTAL: 

AIQLs (total): 
Hand Raisers (total): 
""")

if __name__ == "__main__":
    main()
