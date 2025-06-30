import React, { forwardRef } from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { THEME_COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../../constants';

/**
 * Custom TextInput atom component
 * @param {Object} props - TextInput props
 * @param {string} props.variant - Input variant (outlined, filled)
 * @param {string} props.size - Input size (small, medium, large)
 * @param {boolean} props.error - Whether input has error state
 * @param {string} props.errorText - Error message text
 * @param {Function} props.onChangeText - Text change handler
 * @param {string} props.value - Input value
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {Object} props.style - Additional styles
 */
const TextInput = forwardRef(({
    variant = 'outlined',
    size = 'medium',
    error = false,
    errorText,
    onChangeText,
    value,
    placeholder,
    disabled = false,
    style,
    ...props
}, ref) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    height: 40,
                    fontSize: FONT_SIZES.sm,
                };
            case 'large':
                return {
                    height: 60,
                    fontSize: FONT_SIZES.lg,
                };
            case 'medium':
            default:
                return {
                    height: 50,
                    fontSize: FONT_SIZES.md,
                };
        }
    };

    const inputStyle = [
        styles.input,
        getSizeStyles(),
        style,
    ];

    return (
        <PaperTextInput
            ref={ref}
            mode={variant}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            style={inputStyle}
            contentStyle={styles.content}
            outlineStyle={styles.outline}
            theme={{
                colors: {
                    primary: THEME_COLORS.primary,
                    error: THEME_COLORS.danger,
                    onSurfaceVariant: THEME_COLORS.dark,
                },
            }}
            {...props}
        />
    );
});

const styles = StyleSheet.create({
    input: {
        backgroundColor: THEME_COLORS.white,
    },
    content: {
        paddingHorizontal: SPACING.sm,
    },
    outline: {
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
    },
});

export default TextInput;
