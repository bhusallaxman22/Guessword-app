import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Import pages
import {
  SplashScreen as AppSplashScreen,
  GameScreen,
  MenuScreen,
  LeaderboardScreen,
  InstructionsScreen,
  SettingsScreen,
  ScribbleScreen,
} from './src/pages';

// Import theme and hooks
import { useThemeColors } from './src/hooks/useThemeColors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const THEME_COLORS = useThemeColors();

  /**
   * Paper theme configuration
   */
  const paperTheme = {
    colors: {
      primary: THEME_COLORS.primary,
      secondary: THEME_COLORS.secondary,
      surface: THEME_COLORS.white,
      background: THEME_COLORS.light,
      error: THEME_COLORS.danger,
      onSurface: THEME_COLORS.dark,
      onBackground: THEME_COLORS.dark,
    },
  };

  /**
   * Navigation theme configuration
   */
  const navigationTheme = {
    dark: false,
    colors: {
      primary: THEME_COLORS.primary,
      background: THEME_COLORS.light,
      card: THEME_COLORS.white,
      text: THEME_COLORS.dark,
      border: THEME_COLORS.border,
      notification: THEME_COLORS.danger,
    },
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          // Add any custom fonts here
        });

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!appIsReady) {
    return null;
  }

  if (showSplash) {
    return (
      <PaperProvider theme={paperTheme}>
        <StatusBar style="light" backgroundColor={THEME_COLORS.primary} />
        <AppSplashScreen onComplete={handleSplashComplete} />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" backgroundColor={THEME_COLORS.primary} />
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{
            headerStyle: {
              backgroundColor: THEME_COLORS.primary,
            },
            headerTintColor: THEME_COLORS.white,
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              title: 'GUESSWORD',
              headerShown: false, // Hide header for main menu
            }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              title: 'Game',
              headerShown: false, // Hide header for game screen
            }}
          />
          <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
              title: 'Leaderboard',
              headerShown: false, // Hide header for leaderboard
            }}
          />
          <Stack.Screen
            name="Instructions"
            component={InstructionsScreen}
            options={{
              title: 'How to Play',
              headerShown: false, // Hide header for instructions
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerShown: false, // Hide header for settings
            }}
          />
          <Stack.Screen
            name="Scribble"
            component={ScribbleScreen}
            options={{
              title: 'Scribble',
              headerShown: false, // Hide header for scribble screen
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
