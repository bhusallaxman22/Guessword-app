# 🚀 Quick Build Instructions

## Ready to build APK and IPA! 📱🍎

### Option 1: Automated Build Script
```bash
./build-app.sh
```

### Option 2: Manual Commands

#### Build Android APK (Recommended - Fast)
```bash
npx eas build --platform android --profile preview
```

#### Build iOS IPA
```bash
npx eas build --platform ios --profile production
```

#### Build Both Platforms
```bash
npx eas build --platform all --profile production
```

---

## 📋 Build Process

1. **Login Status**: ✅ You're logged in as `bhusallaxman22`
2. **Configuration**: ✅ `app.json` and `eas.json` are configured
3. **Ready to build**: ✅ All dependencies installed

---

## ⏱️ Expected Build Times

- **Android APK**: ~10-15 minutes
- **iOS IPA**: ~15-20 minutes
- **Both platforms**: ~20-30 minutes

---

## 📥 After Build Completion

1. **Check build status:**
   ```bash
   npx eas build:list
   ```

2. **Download apps:**
   - Visit: https://expo.dev/accounts/bhusallaxman22/projects/guessword-native-app/builds
   - Or click download links in terminal output

---

## 🎯 Recommended Next Steps

1. **Start with Android APK** (faster to build and test)
2. **Test on Android device** 
3. **Build iOS IPA** for App Store or TestFlight
4. **Distribute your game!** 🎮

---

## 🔗 Useful Links

- **Your Expo Dashboard**: https://expo.dev/accounts/bhusallaxman22/projects
- **Build Documentation**: https://docs.expo.dev/build/introduction/
- **App Store Guidelines**: https://developer.apple.com/app-store/guidelines/

---

## ⚡ Quick Start (Recommended)

Run this command to start building your Android APK:

```bash
npx eas build --platform android --profile preview
```

**This will create a production-ready APK file that you can install on any Android device!**

🎮 Happy Gaming!
