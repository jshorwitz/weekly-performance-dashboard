#!/usr/bin/env python3
"""
Query ad_metrics table from synter-media database and update dashboard.
Usage: python update-from-database.py --week-ending 2025-10-26
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Update dashboard from database')
    parser.add_argument('--week-ending', help='Week ending date (YYYY-MM-DD)', required=True)
    args = parser.parse_args()
    
    week_end = datetime.strptime(args.week_ending, '%Y-%m-%d').date()
    week_start = week_end - timedelta(days=6)
    
    print(f"📅 Fetching data for week ending: {week_end.strftime('%m/%d')}")
    print(f"    ({week_start} to {week_end})\n")
    
    # Check for MySQL connection details
    print("⚠️  To complete this, I need:")
    print("    1. MySQL/PostgreSQL connection details from synter-media")
    print("    2. Or access to the database where ad_metrics are stored")
    print("\n💡 Alternative: Do you have a Google Sheet or CSV export with weekly aggregated data?")
    print("    That would be faster to integrate.\n")
    
    print("🔍 Found database schema with 'ad_metrics' table in synter-media/migrations/001_init.sql")
    print("    The table has: platform, date, impressions, clicks, spend, conversions")
    print("\n📝 Suggested SQL query to run:")
    print(f"""
SELECT 
    platform,
    SUM(impressions) as total_impressions,
    SUM(clicks) as total_clicks,
    SUM(spend) as total_spend,
    SUM(conversions) as total_conversions
FROM ad_metrics
WHERE date >= '{week_start}' AND date <= '{week_end}'
GROUP BY platform;
    """)

if __name__ == "__main__":
    main()
