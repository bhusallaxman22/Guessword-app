# GUESSWORD - React Native Game

A word guessing game built with React Native and Expo, featuring multiple levels, leaderboards, and a beautiful Material UI design following atomic design principles.

![GUESSWORD Logo](./assets/adaptive-icon.png)

## 🎮 Game Overview

GUESSWORD is an engaging word puzzle game where players have to guess a hidden 4-letter word within 8 attempts. Players progress through multiple levels, compete on leaderboards, and track their statistics.

### ✨ Features

- 🎯 **Multiple Levels**: Progress through increasingly challenging word puzzles
- 🏆 **Leaderboards**: Compete with other players and track your ranking
- 📊 **Statistics**: Monitor your progress, win rate, and streaks
- 📱 **Offline Play**: Play anytime, even without internet connection
- 🎨 **Material Design**: Beautiful UI following Material Design guidelines
- ⚡ **Responsive**: Optimized for all mobile screen sizes
- 🔧 **Atomic Design**: Clean, maintainable component architecture

### 🎲 How to Play

1. Guess the hidden 4-letter word in 8 tries or less
2. After each guess, you'll see two scores:
   - **Green**: Number of letters in correct positions
   - **Yellow**: Number of letters in the word but wrong positions
3. Use the feedback to narrow down your next guess
4. Complete levels to unlock new challenges

## 🏗️ Architecture

This project follows **Atomic Design** principles for component organization:

```
src/
├── components/
│   ├── atoms/           # Basic UI elements (Button, Text, Input, etc.)
│   ├── molecules/       # Small component groups (WordInput, ScoreDisplay, etc.)
│   ├── organisms/       # Complex UI sections (GameBoard, Leaderboard, etc.)
│   └── templates/       # Page layouts (GameTemplate, MenuTemplate, etc.)
├── pages/               # Screen components (GameScreen, MenuScreen, etc.)
├── hooks/               # Custom React hooks (useGameLogic, useUserData, etc.)
├── utils/               # Utility functions (gameUtils, storage, etc.)
├── services/            # API calls and external services
└── constants/           # App constants and configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/guessword-native-app.git
   cd guessword-native-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install the Expo Go app on your mobile device
   - Scan the QR code with your camera (iOS) or Expo Go app (Android)
   
   **Or use a simulator:**
   ```bash
   npm run ios     # For iOS simulator
   npm run android # For Android emulator
   npm run web     # For web browser
   ```

## 📱 Supported Platforms

- ✅ iOS (iPhone & iPad)
- ✅ Android (Phone & Tablet)
- ✅ Web (responsive design)

## 🛠️ Tech Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library
- **React Native Paper**: Material Design components

### State Management & Data
- **React Hooks**: Built-in state management
- **AsyncStorage**: Local data persistence
- **Custom Hooks**: Reusable business logic

### Styling & UI
- **Material Design**: Design system
- **Linear Gradient**: Beautiful backgrounds
- **Responsive Design**: Works on all screen sizes

## 🎨 Design System

### Color Palette
- **Primary**: #5e72e4 (Indigo)
- **Secondary**: #f5365c (Red)
- **Success**: #2dce89 (Green)
- **Warning**: #fbcf33 (Yellow)
- **Danger**: #f5365c (Red)

### Typography
- **Font Family**: System fonts for optimal performance
- **Sizes**: Responsive text sizing from xs (12px) to header (36px)

### Spacing
- **Grid System**: 4px base unit (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px)

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Building for Production

### Build for Android
```bash
expo build:android
```

### Build for iOS
```bash
expo build:ios
```

### Build for Web
```bash
expo build:web
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
API_BASE_URL=https://your-api-endpoint.com
ENCRYPTION_KEY=your-encryption-key
```

### App Configuration
Edit `app.json` to customize:
- App name and description
- Icons and splash screens
- Platform-specific settings

## 📚 Project Structure Details

### Atomic Design Components

#### Atoms
- `Button`: Reusable button component with variants
- `Text`: Typography component with consistent styling
- `TextInput`: Form input with validation
- `LetterBox`: Special input for single letters
- `Badge`: Score display badges
- `Card`: Container component

#### Molecules
- `WordInput`: 4-letter word input component
- `GuessRow`: Single guess display with scores
- `ScoreDisplay`: Green/yellow score indicators
- `GameStats`: Game statistics display
- `Modal`: Alert and confirmation modals

#### Organisms
- `GameBoard`: Main game interface
- `GuessHistory`: List of all guesses
- `Leaderboard`: Top players display

#### Templates
- `BaseTemplate`: App layout wrapper
- `GameTemplate`: Game screen layout
- `MenuTemplate`: Menu screens layout
- `SplashTemplate`: Splash screen layout

### Custom Hooks

- `useGameLogic`: Manages game state and rules
- `useUserData`: Handles user authentication and data
- `useLeaderboard`: Manages leaderboard and statistics

### Services

- `wordService`: API calls for words and results
- Game data encryption/decryption
- Mock implementations for offline play

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow atomic design principles
- Use TypeScript-style JSDoc comments
- Write meaningful commit messages
- Test on both iOS and Android
- Ensure responsive design works on all screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material Design for the design system
- React Native community for excellent libraries
- Expo team for the amazing development platform
- Word list providers for game content

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/yourusername/guessword-native-app/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the development team

---

## 🚀 Roadmap

### Version 1.1
- [ ] Sound effects and haptic feedback
- [ ] Animated transitions
- [ ] Dark mode support
- [ ] Social sharing features

### Version 1.2
- [ ] Multiplayer mode
- [ ] Custom word lists
- [ ] Achievements system
- [ ] Cloud sync

### Version 2.0
- [ ] 5-letter word mode
- [ ] Timed challenges
- [ ] Tournament mode
- [ ] Advanced statistics

---

**Made with ❤️ using React Native and Expo**
