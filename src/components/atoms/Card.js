import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { THEME_COLORS, BORDER_RADIUS, SPACING } from '../../constants';

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

const styles = StyleSheet.create({
    card: {
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: THEME_COLORS.white,
    },
    content: {
        padding: 0,
    },
    elevated: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    outlined: {
        borderWidth: 1,
        borderColor: THEME_COLORS.letterBoxBorder,
        elevation: 0,
    },
    filled: {
        backgroundColor: THEME_COLORS.light,
        elevation: 0,
    },
});

export default Card;
