import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { BORDER_RADIUS, SPACING, FONT_SIZES } from '../../constants';

/**
 * Custom LetterBox atom component for word input
 * @param {Object} props - LetterBox props
 * @param {string} props.value - Current letter value
 * @param {Function} props.onChangeText - Text change handler
 * @param {Function} props.onFocus - Focus handler
 * @param {Function} props.onKeyPress - Key press handler
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.error - Whether box has error state
 * @param {boolean} props.focused - Whether box is focused
 * @param {Object} props.style - Additional styles
 */
const LetterBox = React.forwardRef(({
    value = '',
    onChangeText,
    onFocus,
    onKeyPress,
    disabled = false,
    error = false,
    focused = false,
    style,
    ...props
}, ref) => {
    const themeColors = useThemeColors();

    const styles = StyleSheet.create({
        letterBox: {
            width: 48,
            height: 48,
            borderRadius: BORDER_RADIUS.md,
            borderWidth: 2,
            borderColor: themeColors.border,
            backgroundColor: themeColors.cardBackground,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 2,
            shadowColor: themeColors.cardShadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
        input: {
            width: '100%',
            height: '100%',
            textAlign: 'center',
            fontSize: FONT_SIZES.lg,
            fontWeight: '700',
            padding: 0,
            margin: 0,
            borderWidth: 0,
            backgroundColor: 'transparent',
            color: themeColors.textPrimary,
        },
        focused: {
            borderColor: themeColors.primary,
            borderWidth: 2.5,
            transform: [{ scale: 1.05 }],
            shadowColor: themeColors.primary,
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
        },
        error: {
            borderColor: themeColors.danger,
            backgroundColor: '#fff5f5',
            shadowColor: themeColors.danger,
            shadowOpacity: 0.2,
        },
        disabled: {
            opacity: 0.6,
            backgroundColor: themeColors.light,
            borderColor: themeColors.border,
        },
    });

    const boxStyle = [
        styles.letterBox,
        focused && styles.focused,
        error && styles.error,
        disabled && styles.disabled,
        style,
    ];

    return (
        <View style={boxStyle}>
            <TextInput
                ref={ref}
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={props.onBlur}
                onKeyPress={onKeyPress}
                maxLength={1}
                autoCapitalize="characters"
                autoCorrect={false}
                selectTextOnFocus
                editable={!disabled}
                showSoftInputOnFocus={false}
                caretHidden={true}
                style={styles.input}
                {...props}
            />
        </View>
    );
});

export default LetterBox;
