import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { FONT_SIZES, SPACING } from '../../constants';
import { useThemeColors } from '../../hooks/useThemeColors';

/**
 * Custom Text atom component
 * @param {Object} props - Text props
 * @param {string} props.variant - Text variant (h1, h2, h3, h4, body1, body2, caption, subtitle)
 * @param {string} props.color - Text color
 * @param {string} props.align - Text alignment (left, center, right, justify)
 * @param {string} props.weight - Font weight (normal, bold, 100-900)
 * @param {boolean} props.italic - Whether text is italic
 * @param {string} props.children - Text content
 * @param {Object} props.style - Additional styles
 */
const Text = ({
    variant = 'body1',
    color = 'dark',
    align = 'left',
    weight = 'normal',
    italic = false,
    children,
    style,
    ...props
}) => {
    const THEME_COLORS = useThemeColors();

    const styles = StyleSheet.create({
        text: {
            fontFamily: 'System',
        },
        h1: {
            fontSize: FONT_SIZES.header,
            fontWeight: '700',
            marginBottom: SPACING.md,
            lineHeight: FONT_SIZES.header * 1.2,
        },
        h2: {
            fontSize: FONT_SIZES.title,
            fontWeight: '600',
            marginBottom: SPACING.sm,
            lineHeight: FONT_SIZES.title * 1.2,
        },
        h3: {
            fontSize: FONT_SIZES.xxl,
            fontWeight: '600',
            marginBottom: SPACING.sm,
            lineHeight: FONT_SIZES.xxl * 1.2,
        },
        h4: {
            fontSize: FONT_SIZES.xl,
            fontWeight: '600',
            marginBottom: SPACING.xs,
            lineHeight: FONT_SIZES.xl * 1.2,
        },
        subtitle: {
            fontSize: FONT_SIZES.lg,
            fontWeight: '500',
            marginBottom: SPACING.xs,
            lineHeight: FONT_SIZES.lg * 1.3,
        },
        body1: {
            fontSize: FONT_SIZES.md,
            fontWeight: '400',
            lineHeight: FONT_SIZES.md * 1.4,
        },
        body2: {
            fontSize: FONT_SIZES.sm,
            fontWeight: '400',
            lineHeight: FONT_SIZES.sm * 1.4,
        },
        caption: {
            fontSize: FONT_SIZES.xs,
            fontWeight: '400',
            lineHeight: FONT_SIZES.xs * 1.3,
        },
    });

    const getVariantStyles = () => {
        switch (variant) {
            case 'h1':
                return styles.h1;
            case 'h2':
                return styles.h2;
            case 'h3':
                return styles.h3;
            case 'h4':
                return styles.h4;
            case 'subtitle':
                return styles.subtitle;
            case 'body2':
                return styles.body2;
            case 'caption':
                return styles.caption;
            case 'body1':
            default:
                return styles.body1;
        }
    };

    const getColor = () => {
        if (THEME_COLORS[color]) {
            return THEME_COLORS[color];
        }
        return color;
    };

    const textStyle = [
        styles.text,
        getVariantStyles(),
        {
            color: getColor(),
            textAlign: align,
            fontWeight: weight,
            fontStyle: italic ? 'italic' : 'normal',
        },
        style,
    ];

    return (
        <RNText style={textStyle} {...props}>
            {children}
        </RNText>
    );
};

export default Text;
