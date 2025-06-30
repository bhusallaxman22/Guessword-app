import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { THEME_COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../../constants';

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

const styles = StyleSheet.create({
    letterBox: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: THEME_COLORS.letterBoxBorder,
        backgroundColor: THEME_COLORS.letterBoxBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        padding: 0,
        margin: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        color: THEME_COLORS.dark,
    },
    focused: {
        borderColor: THEME_COLORS.primary,
        transform: [{ scale: 1.05 }],
        shadowColor: THEME_COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    error: {
        borderColor: THEME_COLORS.danger,
        shadowColor: THEME_COLORS.danger,
    },
    disabled: {
        opacity: 0.6,
        backgroundColor: THEME_COLORS.light,
    },
});

export default LetterBox;
