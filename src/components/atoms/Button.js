import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { THEME_COLORS, BORDER_RADIUS, SPACING } from '../../constants';

/**
 * Custom Button atom component
 * @param {Object} props - Button props
 * @param {string} props.mode - Button mode (contained, outlined, text)
 * @param {string} props.variant - Button variant (primary, secondary, success, warning, danger)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {Function} props.onPress - Button press handler
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.children - Button text
 * @param {Object} props.style - Additional styles
 */
const Button = ({
    mode = 'contained',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    onPress,
    disabled = false,
    loading = false,
    children,
    style,
    ...props
}) => {
    const getButtonColor = () => {
        switch (variant) {
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

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return styles.smallButton;
            case 'large':
                return styles.largeButton;
            case 'medium':
            default:
                return styles.mediumButton;
        }
    };

    const buttonStyle = [
        styles.button,
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        style,
    ];

    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            disabled={disabled || loading}
            loading={loading}
            buttonColor={mode === 'contained' ? getButtonColor() : THEME_COLORS.transparent}
            textColor={mode === 'contained' ? THEME_COLORS.white : getButtonColor()}
            style={buttonStyle}
            contentStyle={styles.content}
            labelStyle={[styles.label, getSizeStyles()]}
            {...props}
        >
            {children}
        </PaperButton>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.md,
        elevation: 2,
    },
    content: {
        paddingVertical: SPACING.xs,
    },
    label: {
        fontWeight: '600',
    },
    smallButton: {
        fontSize: 14,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    mediumButton: {
        fontSize: 16,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    largeButton: {
        fontSize: 18,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    fullWidth: {
        width: '100%',
    },
});

export default Button;
