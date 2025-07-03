import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from '../components/atoms';
import { AlertModal } from '../components/molecules';
import { MenuTemplate } from '../components/templates';
import { useUserData } from '../hooks/useUserData';
import { useTheme } from '../hooks/useTheme';
import { useThemeColors, updateGlobalTheme } from '../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS } from '../constants';
import { storage } from '../utils/storage';

/**
 * SettingsScreen page component
 * @param {Object} props - SettingsScreen props
 * @param {Function} props.navigation - Navigation object
 */
const SettingsScreen = ({ navigation }) => {
    const { username, updateUsername } = useUserData();
    const { availableThemes } = useTheme();
    const THEME_COLORS = useThemeColors();
    const [settings, setSettings] = useState({
        difficulty: 'medium',
        theme: 'default',
        username: username || 'Player'
    });
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');


    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            alignItems: 'center',
            paddingVertical: SPACING.xl,
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.xl + SPACING.md,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 8,
            width: '95%',
            maxWidth: 400,
            marginBottom: SPACING.lg,
        },
        title: {
            fontSize: 36,
            letterSpacing: 1,
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
            paddingTop: SPACING.sm,
        },
        subtitle: {
            marginTop: SPACING.sm,
            opacity: 0.9,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            padding: SPACING.lg,
            gap: SPACING.lg,
        },
        sectionCard: {
            marginBottom: SPACING.md,
        },
        sectionTitle: {
            marginBottom: SPACING.xs,
        },
        sectionDescription: {
            marginBottom: SPACING.lg,
            lineHeight: 20,
        },
        optionsContainer: {
            gap: SPACING.sm,
        },
        optionButton: {
            padding: SPACING.md,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 1,
            borderColor: THEME_COLORS.border,
            backgroundColor: THEME_COLORS.white,
            marginBottom: SPACING.xs,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
        },
        selectedOption: {
            borderWidth: 2,
            borderColor: THEME_COLORS.primary,
            backgroundColor: THEME_COLORS.primary,
        },
        optionContent: {
            alignItems: 'flex-start',
        },
        themeContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.sm,
            justifyContent: 'space-between',
        },
        themeButton: {
            flex: 1,
            minWidth: '30%',
            maxWidth: '32%',
            aspectRatio: 1,
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.sm,
            borderWidth: 1,
            borderColor: THEME_COLORS.border,
            backgroundColor: THEME_COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
        },
        selectedTheme: {
            borderWidth: 2,
            borderColor: THEME_COLORS.primary,
            backgroundColor: THEME_COLORS.light,
        },
        themePreview: {
            flexDirection: 'row',
            marginBottom: SPACING.xs,
        },
        themeColor: {
            width: 16,
            height: 16,
            borderRadius: 8,
            marginHorizontal: 2,
        },
        accountItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: SPACING.sm,
        },
        accountInfo: {
            flex: 1,
        },
        editButton: {
            minWidth: 60,
        },
        aboutButtons: {
            gap: SPACING.sm,
        },
        aboutButton: {
            marginBottom: SPACING.xs,
        },
        backButton: {
            position: 'absolute',
            bottom: SPACING.lg,
            left: SPACING.lg,
            right: SPACING.lg,
        },
        backButtonStyle: {
            borderRadius: BORDER_RADIUS.md,
        },
    });
    // Load settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await storage.getItem('gameSettings');
            if (savedSettings) {
                setSettings(prev => ({ ...prev, ...savedSettings }));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (newSettings) => {
        try {
            await storage.setItem('gameSettings', newSettings);
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Failed to save settings. Please try again.');
        }
    };

    const handleDifficultyChange = (difficulty) => {
        const newSettings = { ...settings, difficulty };
        saveSettings(newSettings);
    };

    const handleThemeChange = async (theme) => {
        const newSettings = { ...settings, theme };

        // Update the global theme immediately
        await updateGlobalTheme(theme);

        // Save the settings
        saveSettings(newSettings);
    };

    const handleUsernameChange = async () => {
        if (!newUsername.trim()) {
            Alert.alert('Error', 'Please enter a valid username');
            return;
        }

        try {
            await updateUsername(newUsername.trim());
            const newSettings = { ...settings, username: newUsername.trim() };
            saveSettings(newSettings);
            setShowUsernameModal(false);
            setNewUsername('');
            Alert.alert('Success', 'Username updated successfully!');
        } catch (error) {
            console.error('Error updating username:', error);
            Alert.alert('Error', 'Failed to update username. Please try again.');
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text variant="h2" color="white" weight="700" align="center" style={styles.title}>
                Settings
            </Text>
            <Text variant="subtitle" color="white" align="center" style={styles.subtitle}>
                Customize your game experience
            </Text>
        </View>
    );

    const renderDifficultySection = () => (
        <Card variant="elevated" padding="large" style={styles.sectionCard}>
            <Text variant="h4" color="primary" weight="600" style={styles.sectionTitle}>
                Difficulty Mode
            </Text>
            <Text variant="body2" color="textSecondary" style={styles.sectionDescription}>
                Choose how much feedback you want from the keyboard
            </Text>

            <View style={styles.optionsContainer}>
                {[
                    {
                        id: 'easy',
                        label: 'Easy',
                        description: 'Full color feedback on keyboard (Green, Yellow, Grey)'
                    },
                    {
                        id: 'medium',
                        label: 'Medium',
                        description: 'Only grey out incorrect letters'
                    },
                    {
                        id: 'hard',
                        label: 'Hard',
                        description: 'Grey out only if all letters are wrong'
                    },
                    {
                        id: 'raw',
                        label: 'Raw',
                        description: 'No keyboard feedback at all'
                    }
                ].map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => handleDifficultyChange(option.id)}
                        style={[
                            styles.optionButton,
                            settings.difficulty === option.id && styles.selectedOption
                        ]}
                    >
                        <View style={styles.optionContent}>
                            <Text variant="body1" weight="600" color={settings.difficulty === option.id ? "white" : "textPrimary"}>
                                {option.label}
                            </Text>
                            <Text variant="caption" color={settings.difficulty === option.id ? "white" : "textSecondary"}>
                                {option.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Card>
    );

    const renderThemeSection = () => {
        const themeOptions = [
            { id: 'default', label: 'Default', primary: '#667eea', secondary: '#f093fb' },
            { id: 'ocean', label: 'Ocean', primary: '#4ecdc4', secondary: '#74b9ff' },
            { id: 'sunset', label: 'Sunset', primary: '#fd79a8', secondary: '#ffeaa7' },
            { id: 'forest', label: 'Forest', primary: '#00b894', secondary: '#55a3ff' },
            { id: 'dark', label: 'Dark', primary: '#2d3436', secondary: '#636e72' }
        ];

        return (
            <Card variant="elevated" padding="large" style={styles.sectionCard}>
                <Text variant="h4" color="primary" weight="600" style={styles.sectionTitle}>
                    Theme
                </Text>
                <Text variant="body2" color="textSecondary" style={styles.sectionDescription}>
                    Choose your preferred color theme
                </Text>

                <View style={styles.themeContainer}>
                    {themeOptions.map((theme) => (
                        <TouchableOpacity
                            key={theme.id}
                            onPress={() => handleThemeChange(theme.id)}
                            style={[
                                styles.themeButton,
                                settings.theme === theme.id && styles.selectedTheme
                            ]}
                        >
                            <View style={styles.themePreview}>
                                <View style={[styles.themeColor, { backgroundColor: theme.primary }]} />
                                <View style={[styles.themeColor, { backgroundColor: theme.secondary }]} />
                            </View>
                            <Text variant="caption" color="textPrimary">
                                {theme.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Card>
        );
    };

    const renderAccountSection = () => (
        <Card variant="elevated" padding="large" style={styles.sectionCard}>
            <Text variant="h4" color="primary" weight="600" style={styles.sectionTitle}>
                Account
            </Text>

            <View style={styles.accountItem}>
                <View style={styles.accountInfo}>
                    <Text variant="body1" weight="600" color="textPrimary">
                        Username
                    </Text>
                    <Text variant="body2" color="textSecondary">
                        {settings.username}
                    </Text>
                </View>
                <Button
                    mode="outlined"
                    variant="primary"
                    size="small"
                    onPress={() => {
                        setNewUsername(settings.username);
                        setShowUsernameModal(true);
                    }}
                    style={styles.editButton}
                >
                    Edit
                </Button>
            </View>
        </Card>
    );

    const renderAboutSection = () => (
        <Card variant="elevated" padding="large" style={styles.sectionCard}>
            <Text variant="h4" color="primary" weight="600" style={styles.sectionTitle}>
                About
            </Text>

            <View style={styles.aboutButtons}>
                <Button
                    mode="outlined"
                    variant="secondary"
                    onPress={() => setShowAboutModal(true)}
                    style={styles.aboutButton}
                >
                    About GUESSWORD
                </Button>
                <Button
                    mode="outlined"
                    variant="secondary"
                    onPress={() => setShowPrivacyModal(true)}
                    style={styles.aboutButton}
                >
                    Privacy Policy
                </Button>
            </View>
        </Card>
    );

    const renderContent = () => (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {renderDifficultySection()}
                {renderThemeSection()}
                {renderAccountSection()}
                {renderAboutSection()}
            </View>
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <MenuTemplate
                header={renderHeader()}
                content={renderContent()}
                centered={false}
            />

            {/* Username Modal */}
            <AlertModal
                visible={showUsernameModal}
                onDismiss={() => setShowUsernameModal(false)}
                title="Change Username"
                message="Enter your new username:"
                type="input"
                inputValue={newUsername}
                onInputChange={setNewUsername}
                actions={[
                    {
                        label: 'Cancel',
                        onPress: () => setShowUsernameModal(false),
                        variant: 'secondary'
                    },
                    {
                        label: 'Save',
                        onPress: handleUsernameChange,
                        variant: 'primary',
                        primary: true
                    }
                ]}
            />

            {/* About Modal */}
            <AlertModal
                visible={showAboutModal}
                onDismiss={() => setShowAboutModal(false)}
                title="About GUESSWORD"
                message="GUESSWORD v1.0.0\n\nA challenging word guessing game where you have to find 4-letter words in 8 tries or less.\n\nDeveloped by: Your Name\nBuilt with React Native & Expo\n\nFeatures:\n• Multiple difficulty modes\n• Progress tracking\n• Leaderboard system\n• Customizable themes\n• Offline play support"
                type="info"
                actions={[
                    {
                        label: 'Close',
                        onPress: () => setShowAboutModal(false),
                        variant: 'primary',
                        primary: true
                    }
                ]}
            />

            {/* Privacy Policy Modal */}
            <AlertModal
                visible={showPrivacyModal}
                onDismiss={() => setShowPrivacyModal(false)}
                title="Privacy Policy"
                message="Privacy Policy\n\nThis app stores your game data locally on your device. We do not collect or share any personal information.\n\nData stored locally:\n• Your username\n• Game progress and statistics\n• Settings and preferences\n\nNo data is transmitted to external servers. All your information remains private and secure on your device.\n\nFor questions about privacy, please contact the developer."
                type="info"
                actions={[
                    {
                        label: 'Close',
                        onPress: () => setShowPrivacyModal(false),
                        variant: 'primary',
                        primary: true
                    }
                ]}
            />

            {/* Back Button */}
            <View style={styles.backButton}>
                <Button
                    mode="outlined"
                    variant="secondary"
                    onPress={() => navigation.goBack()}
                    style={styles.backButtonStyle}
                >
                    ← Back to Menu
                </Button>
            </View>
        </View>
    );
};

export default SettingsScreen;
