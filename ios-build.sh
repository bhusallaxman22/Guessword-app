#!/bin/bash

# iOS Local Build Helper for GUESSWORD
echo "🍎 GUESSWORD iOS Local Build Helper"
echo "=================================="
echo ""

# Check if Xcode is available
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode is not installed or not in PATH"
    exit 1
fi

echo "✅ Xcode $(xcodebuild -version | head -1) detected"

# Check if iOS project exists
if [ ! -d "ios/GUESSWORD.xcworkspace" ]; then
    echo "❌ iOS project not found. Run 'npx expo prebuild --platform ios' first"
    exit 1
fi

echo "✅ iOS project found"

echo ""
echo "🚀 Options:"
echo "1. Open in Xcode (recommended)"
echo "2. Build for iOS Simulator"
echo "3. Start Metro bundler only"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo "📱 Opening GUESSWORD project in Xcode..."
        open ios/GUESSWORD.xcworkspace
        echo ""
        echo "💡 In Xcode:"
        echo "   - Select a simulator or connected device"
        echo "   - Click ▶️ to build and run"
        echo "   - For IPA: Product → Archive → Distribute App"
        ;;
    2)
        echo "🏗️  Building for iOS Simulator..."
        echo "Starting Metro bundler in background..."
        npx expo start &
        METRO_PID=$!
        echo "Metro PID: $METRO_PID"
        
        sleep 5
        echo "Building iOS app..."
        cd ios
        xcodebuild -workspace GUESSWORD.xcworkspace -scheme GUESSWORD -destination 'platform=iOS Simulator,name=iPhone 15' build
        
        if [ $? -eq 0 ]; then
            echo "✅ Build successful!"
            echo "💡 To run: Use Xcode or iOS simulator"
        else
            echo "❌ Build failed. Check errors above."
        fi
        
        # Kill Metro
        kill $METRO_PID 2>/dev/null
        ;;
    3)
        echo "📦 Starting Metro bundler..."
        npx expo start
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎮 Build Summary:"
echo "✅ Android APK: https://expo.dev/artifacts/eas/4EzQt64UuqzUBxMgfT2ZQW.apk"
echo "🍎 iOS: Building locally with Xcode"
