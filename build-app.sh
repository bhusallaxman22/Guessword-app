#!/bin/bash

# GUESSWORD Build Script
# This script will build both Android APK and iOS IPA

echo "🎮 GUESSWORD - Building APK and IPA"
echo "=================================="
echo ""

# Check if logged in
echo "📝 Checking EAS login status..."
if npx eas whoami > /dev/null 2>&1; then
    USER=$(npx eas whoami)
    echo "✅ Logged in as: $USER"
else
    echo "❌ Not logged in. Please run: npx eas login"
    exit 1
fi

echo ""
echo "🚀 Starting build process..."
echo ""

# Build Android APK
echo "📱 Building Android APK..."
echo "⏱️  This will take approximately 10-15 minutes"
echo "🔗 You can monitor progress at: https://expo.dev"
echo ""

npx eas build --platform android --profile preview --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ Android APK build started successfully!"
else
    echo "❌ Android APK build failed!"
    exit 1
fi

echo ""
echo "🍎 Building iOS IPA..."
echo "⏱️  This will take approximately 15-20 minutes"
echo ""

npx eas build --platform ios --profile production --non-interactive

if [ $? -eq 0 ]; then
    echo "✅ iOS IPA build started successfully!"
else
    echo "❌ iOS IPA build failed!"
fi

echo ""
echo "🎯 Build Summary:"
echo "• Android APK: Preview build (faster, good for testing)"
echo "• iOS IPA: Production build (optimized for distribution)"
echo ""
echo "📥 Download your builds from:"
echo "https://expo.dev/accounts/$USER/projects/guessword-native-app/builds"
echo ""
echo "🔍 Check build status:"
echo "npx eas build:list"
echo ""
echo "🎮 Your GUESSWORD app builds are in progress!"
