import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { useThemeColors } from '../../hooks/useThemeColors';
import { BORDER_RADIUS, SPACING } from '../../constants';

/**
 * Custom Card atom component
 * @param {Object} props - Card props
 * @param {string} props.variant - Card variant (elevated, outlined, filled)
 * @param {string} props.padding - Padding size (none, small, medium, large)
 * @param {ReactNode} props.children - Card content
 * @param {Function} props.onPress - Press handler for clickable cards
 * @param {Object} props.style - Additional styles
 */
const Card = ({
    variant = 'elevated',
    padding = 'medium',
    children,
    onPress,
    style,
    ...props
}) => {
    const THEME_COLORS = useThemeColors();

    const styles = StyleSheet.create({
        card: {
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: THEME_COLORS.cardBackground,
            overflow: 'hidden',
        },
        content: {
            padding: 0,
        },
        elevated: {
            elevation: 6,
            shadowColor: THEME_COLORS.cardShadow,
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.04)',
        },
        outlined: {
            borderWidth: 1.5,
            borderColor: THEME_COLORS.border,
            elevation: 0,
            shadowColor: 'transparent',
        },
        filled: {
            backgroundColor: THEME_COLORS.light,
            elevation: 2,
            shadowColor: THEME_COLORS.cardShadow,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
    });

    const getPaddingStyles = () => {
        switch (padding) {
            case 'none':
                return { padding: 0 };
            case 'small':
                return { padding: SPACING.sm };
            case 'large':
                return { padding: SPACING.lg };
            case 'medium':
            default:
                return { padding: SPACING.md };
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'outlined':
                return styles.outlined;
            case 'filled':
                return styles.filled;
            case 'elevated':
            default:
                return styles.elevated;
        }
    };

    const cardStyle = [
        styles.card,
        getVariantStyles(),
        getPaddingStyles(),
        style,
    ];

    if (onPress) {
        return (
            <PaperCard
                style={cardStyle}
                onPress={onPress}
                mode={variant}
                {...props}
            >
                <PaperCard.Content style={styles.content}>
                    {children}
                </PaperCard.Content>
            </PaperCard>
        );
    }

    return (
        <View style={cardStyle}>
            {children}
        </View>
    );
};

export default Card;
