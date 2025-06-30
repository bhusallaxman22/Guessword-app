import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge as PaperBadge } from 'react-native-paper';
import { THEME_COLORS, BORDER_RADIUS, SPACING } from '../../constants';

/**
 * Custom Badge atom component for displaying scores
 * @param {Object} props - Badge props
 * @param {string} props.variant - Badge variant (green, yellow, primary, secondary)
 * @param {string} props.size - Badge size (small, medium, large)
 * @param {string|number} props.children - Badge content
 * @param {Object} props.style - Additional styles
 */
const Badge = ({
    variant = 'primary',
    size = 'medium',
    children,
    style,
    ...props
}) => {
    const getVariantColor = () => {
        switch (variant) {
            case 'green':
                return THEME_COLORS.scoreGreen;
            case 'yellow':
                return THEME_COLORS.scoreYellow;
            case 'secondary':
                return THEME_COLORS.secondary;
            case 'success':
                return THEME_COLORS.success;
            case 'warning':
                return THEME_COLORS.warning;
            case 'danger':
                return THEME_COLORS.danger;
            case 'primary':
            default:
                return THEME_COLORS.primary;
        }
    };

    const getTextColor = () => {
        // Yellow badge needs dark text for better contrast
        if (variant === 'yellow') {
            return THEME_COLORS.dark;
        }
        return THEME_COLORS.white;
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'large':
                return styles.large;
            case 'medium':
            default:
                return styles.medium;
        }
    };

    const badgeStyle = [
        styles.badge,
        getSizeStyles(),
        { backgroundColor: getVariantColor() },
        style,
    ];

    return (
        <View style={badgeStyle}>
            <PaperBadge
                style={[styles.paperBadge, { backgroundColor: getVariantColor() }]}
                theme={{
                    colors: {
                        onSecondaryContainer: getTextColor(),
                    },
                }}
                {...props}
            >
                {children}
            </PaperBadge>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: BORDER_RADIUS.round,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    paperBadge: {
        alignSelf: 'center',
        fontWeight: '700',
    },
    small: {
        width: 22,
        height: 22,
        fontSize: 12,
    },
    medium: {
        width: 32,
        height: 32,
        fontSize: 14,
    },
    large: {
        width: 40,
        height: 40,
        fontSize: 16,
    },
});

export default Badge;
