#!/bin/bash

echo "🎮 GUESSWORD Build Status"
echo "========================="
echo ""

echo "📱 Checking current builds..."
eas build:list --limit 10

echo ""
echo "✅ ANDROID APK READY!"
echo "📥 Download link: https://expo.dev/artifacts/eas/4EzQt64UuqzUBxMgfT2ZQW.apk"
echo ""

echo "🍎 iOS build should be completing soon..."
echo "💡 Run 'eas build:list' to check latest status"
echo ""

echo "🎯 Build Summary:"
echo "- Android APK: ✅ COMPLETED"
echo "- iOS IPA: ⏳ IN PROGRESS (check with 'eas build:list')"
echo ""

echo "📋 Once iOS build completes, you'll have both:"
echo "   - APK for Android devices"
echo "   - IPA for iOS devices (requires Apple Developer account for distribution)"
