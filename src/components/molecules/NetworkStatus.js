import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms';
import { checkBackendHealth } from '../../services/wordService';
import { THEME_COLORS, SPACING, BORDER_RADIUS } from '../../constants';

/**
 * NetworkStatus molecule component - displays online/offline status
 * @param {Object} props - NetworkStatus props
 * @param {boolean} props.visible - Whether to show the status
 * @param {string} props.position - Position on screen ('top', 'bottom')
 */
const NetworkStatus = ({ visible = true, position = 'top' }) => {
    const [isOnline, setIsOnline] = useState(true);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (!visible) return;

        const checkHealth = async () => {
            setChecking(true);
            try {
                const health = await checkBackendHealth();
                setIsOnline(health);
            } catch (error) {
                setIsOnline(false);
            } finally {
                setChecking(false);
            }
        };

        // Check immediately
        checkHealth();

        // Check every 30 seconds
        const interval = setInterval(checkHealth, 30000);

        return () => clearInterval(interval);
    }, [visible]);

    if (!visible || checking) return null;

    const statusColor = isOnline ? THEME_COLORS.success : THEME_COLORS.warning;
    const statusText = isOnline ? 'Online' : 'Offline';
    const statusIcon = isOnline ? '🟢' : '🟡';

    return (
        <View style={[
            styles.container,
            { backgroundColor: statusColor },
            position === 'bottom' && styles.bottom
        ]}>
            <Text variant="caption" color="white" weight="600">
                {statusIcon} {statusText}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        right: SPACING.md,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bottom: {
        top: 'auto',
        bottom: 100,
    },
});

export default NetworkStatus;
