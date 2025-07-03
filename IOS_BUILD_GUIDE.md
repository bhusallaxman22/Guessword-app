# 🍎 iOS Local Build Guide - GUESSWORD

## 🎯 Current Status
✅ **Android APK**: COMPLETED - https://expo.dev/artifacts/eas/4EzQt64UuqzUBxMgfT2ZQW.apk
🍎 **iOS**: Building locally with Xcode

## 📱 Building iOS App in Xcode

### 1. Xcode Setup
- ✅ Xcode 16.4 is installed
- ✅ iOS project generated (`ios/GUESSWORD.xcworkspace`)
- ✅ Xcode workspace opened

### 2. Build Steps in Xcode

#### A. Select Target Device/Simulator
1. In Xcode, click the device dropdown (top left)
2. Choose either:
   - **iOS Simulator** (for testing)
   - **Your iPhone** (if connected via USB)

#### B. Build for Simulator (Testing)
1. Select "iPhone 15" or any simulator
2. Click **▶️ Build and Run** (Cmd+R)
3. App will install and run in simulator

#### C. Build for Physical Device (IPA)
1. Connect your iPhone via USB
2. Select your iPhone from device list
3. **Important**: You need an Apple Developer account for device installation

#### D. Archive for Distribution (IPA File)
1. In Xcode menu: **Product** → **Archive**
2. When archive completes, click **Distribute App**
3. Choose **Development** (for testing) or **App Store Connect** (for store)
4. Follow the wizard to export IPA file

### 3. Metro Bundler
- Metro bundler should be running in terminal
- If not, run: `npx expo start`
- This serves the JavaScript bundle to the app

### 4. Troubleshooting

#### If Build Fails:
1. **Clean Build**: Product → Clean Build Folder (Cmd+Shift+K)
2. **Pod Issues**: Run `cd ios && pod install` in terminal
3. **Signing**: Check signing & capabilities in Xcode

#### Common Issues:
- **Signing Certificate**: Automatic signing should work for development
- **Bundle ID**: `com.guessword.app` (already configured)
- **Metro Connection**: Ensure Metro bundler is running

### 5. Quick Commands

```bash
# Start Metro bundler
npx expo start

# Rebuild iOS project (if needed)
npx expo prebuild --platform ios --clean

# Install pods (if needed)
cd ios && pod install
```

## 🎮 Final Result
After successful build, you'll have:
- ✅ **Android APK**: Ready for download/install
- 🍎 **iOS App**: Running in simulator or device
- 📦 **IPA File**: (Optional) For distribution

## 📱 Installation
- **Android**: Download APK and install directly
- **iOS**: Install via Xcode or TestFlight (requires Apple Developer account)
