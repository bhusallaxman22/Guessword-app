# Copilot Instructions for GUESSWORD React Native App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React Native Expo application implementing a GUESSWORD game using atomic design principles and Material UI components.

## Architecture Guidelines
- Follow atomic design pattern: atoms, molecules, organisms, templates, pages
- Use functional components with React hooks
- Implement responsive design for mobile devices
- Use Material UI components (react-native-paper) for consistent styling
- Follow clean code principles and proper component separation

## File Structure
- `/src/components/atoms/` - Basic UI elements (buttons, inputs, badges, etc.)
- `/src/components/molecules/` - Small component groups (input groups, score displays, etc.)
- `/src/components/organisms/` - Complex UI sections (game board, leaderboard, etc.)
- `/src/components/templates/` - Page layouts
- `/src/pages/` - Screen components
- `/src/hooks/` - Custom React hooks for game logic
- `/src/utils/` - Utility functions and helpers
- `/src/services/` - API calls and external services
- `/src/constants/` - Game constants and configuration

## Coding Standards
- Use TypeScript-style JSDoc comments for better documentation
- Implement proper error handling and loading states
- Use async/await for asynchronous operations
- Follow React Native performance best practices
- Implement proper navigation using React Navigation
- Use styled-components or StyleSheet for component styling

## Game Features to Implement
- Splash screen with game introduction
- Multi-level word guessing game
- Leaderboard with local storage
- Responsive design for different screen sizes
- Smooth animations and transitions
- Sound effects and haptic feedback
- Offline capability with AsyncStorage
