#!/bin/bash

# Build Status Monitor for GUESSWORD
echo "🔍 GUESSWORD Build Monitor"
echo "=========================="

while true; do
    echo ""
    echo "⏰ $(date)"
    echo "📊 Current Build Status:"
    echo "------------------------"
    
    # Get latest builds
    eas build:list --limit 5 --json > /tmp/builds.json 2>/dev/null
    
    if [ $? -eq 0 ]; then
        # Parse and display build status
        echo "Recent builds:"
        cat /tmp/builds.json | python3 -c "
import json, sys
try:
    builds = json.load(sys.stdin)
    for build in builds[:5]:
        platform = build.get('platform', 'unknown')
        status = build.get('status', 'unknown')
        created = build.get('createdAt', 'unknown')
        buildId = build.get('id', 'unknown')[:8]
        print(f'🔨 {platform.upper()}: {status} (ID: {buildId})')
except:
    print('Error parsing build data')
" 2>/dev/null || echo "Build status check failed"
    else
        echo "❌ Failed to get build status"
    fi
    
    echo ""
    echo "💡 Commands:"
    echo "  - Press Ctrl+C to stop monitoring"
    echo "  - Run 'eas build:list' for detailed status"
    echo "  - Run 'eas build:view [buildId]' for specific build"
    
    # Check if builds are complete
    COMPLETE_COUNT=$(eas build:list --limit 10 --json 2>/dev/null | python3 -c "
import json, sys
try:
    builds = json.load(sys.stdin)
    complete = sum(1 for b in builds if b.get('status') in ['finished', 'errored'])
    print(complete)
except:
    print(0)
" 2>/dev/null || echo 0)
    
    if [ "$COMPLETE_COUNT" -ge 2 ]; then
        echo ""
        echo "🎉 Looks like builds might be complete!"
        echo "📋 Check final status with: eas build:list"
        break
    fi
    
    sleep 30
done
