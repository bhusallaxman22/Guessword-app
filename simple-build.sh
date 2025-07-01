#!/bin/bash

# Simple Build Script for GUESSWORD
echo "🎮 Starting GUESSWORD builds..."
echo "================================"

# Check EAS login
echo "Checking EAS login..."
eas whoami

echo ""
echo "📱 Building Android APK..."
echo "============================"
eas build --platform android --profile production &
ANDROID_PID=$!

echo ""
echo "🍎 Building iOS IPA..."
echo "======================="
eas build --platform ios --profile production &
IOS_PID=$!

echo ""
echo "⏳ Both builds started in parallel..."
echo "Android PID: $ANDROID_PID"
echo "iOS PID: $IOS_PID"

# Wait for both builds to complete
echo "⏳ Waiting for builds to complete..."
wait $ANDROID_PID
ANDROID_EXIT=$?

wait $IOS_PID
IOS_EXIT=$?

echo ""
echo "🎯 Build Results:"
echo "=================="
if [ $ANDROID_EXIT -eq 0 ]; then
    echo "✅ Android APK build: SUCCESS"
else
    echo "❌ Android APK build: FAILED"
fi

if [ $IOS_EXIT -eq 0 ]; then
    echo "✅ iOS IPA build: SUCCESS"
else
    echo "❌ iOS IPA build: FAILED"
fi

echo ""
echo "📋 To check build status and download links:"
echo "eas build:list"
echo ""
echo "🎮 GUESSWORD builds completed!"
