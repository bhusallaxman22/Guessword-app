# 📱 GUESSWORD - Build Guide (APK & IPA)

## 🚀 Building APK (Android) and IPA (iOS)

### Prerequisites ✅
- ✅ Expo CLI installed (`npx expo`)
- ✅ EAS CLI installed (`npx eas`)
- ✅ Project configured with `app.json` and `eas.json`
- ⏳ Expo account required (free)

---

## 🔐 Step 1: Login to Expo

```bash
npx eas login
```

If you don't have an Expo account, create one at: https://expo.dev/signup

---

## 🏗️ Step 2: Configure the Project

The project is already configured, but you may want to update the project ID:

```bash
npx eas init
```

This will create a unique project ID in your Expo account.

---

## 📱 Step 3: Build APK (Android)

### Option A: Production APK
```bash
npx eas build --platform android --profile production
```

### Option B: Preview APK (faster, good for testing)
```bash
npx eas build --platform android --profile preview
```

**Build time:** ~10-15 minutes

---

## 🍎 Step 4: Build IPA (iOS)

```bash
npx eas build --platform ios --profile production
```

**Note:** For iOS builds, you'll need:
- Apple Developer Account ($99/year)
- Proper iOS certificates and provisioning profiles

For testing without Apple Developer Account:
```bash
npx eas build --platform ios --profile production --local
```

**Build time:** ~15-20 minutes

---

## ⚡ Step 5: Build Both Platforms

To build both Android and iOS simultaneously:
```bash
npx eas build --platform all --profile production
```

---

## 📦 Step 6: Download Built Apps

After builds complete:

1. **Check build status:**
   ```bash
   npx eas build:list
   ```

2. **Download APK/IPA:**
   - Visit: https://expo.dev/accounts/[your-username]/projects/guessword-native-app/builds
   - Or use the download links provided in terminal

---

## 🛠️ Alternative: Local Builds

If you want to build locally (requires Android Studio/Xcode):

### Android (APK)
```bash
npx eas build --platform android --local
```

### iOS (IPA)
```bash
npx eas build --platform ios --local
```

**Requirements:**
- **Android:** Android Studio + Android SDK
- **iOS:** Xcode (macOS only)

---

## 📋 Build Profiles Explained

### `production`
- Optimized for app stores
- Smallest file size
- Best performance

### `preview`
- Faster builds
- Good for testing
- Larger file size

### `development`
- Development client
- Hot reloading
- Debug features

---

## 🔧 Troubleshooting

### Common Issues:

1. **"Not logged in"**
   ```bash
   npx eas login
   ```

2. **"Project not found"**
   ```bash
   npx eas init
   ```

3. **iOS Certificate Issues**
   ```bash
   npx eas credentials
   ```

4. **Large app size**
   - Use production profile
   - Check asset optimization

---

## 📱 Final Output

After successful builds, you'll get:

- **📱 APK file** (~50-100MB) for Android
- **🍎 IPA file** (~50-100MB) for iOS

### Installation:
- **Android:** Install APK directly or distribute via Google Play
- **iOS:** Install via TestFlight or App Store

---

## 🎯 Quick Start Commands

```bash
# Login to Expo
npx eas login

# Initialize project
npx eas init

# Build Android APK
npx eas build --platform android --profile production

# Build iOS IPA  
npx eas build --platform ios --profile production

# Check build status
npx eas build:list
```

**Total build time:** ~20-30 minutes for both platforms

🎮 **Your GUESSWORD app is ready for distribution!**
