import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { THEME_COLORS, SPACING, BORDER_RADIUS } from '../../constants';

/**
 * Virtual Keyboard molecule component
 * @param {Object} props - VirtualKeyboard props
 * @param {Function} props.onLetterPress - Callback when letter is pressed
 * @param {Function} props.onBackspace - Callback when backspace is pressed
 * @param {Function} props.onEnter - Callback when enter is pressed
 * @param {Object} props.letterStates - Object mapping letters to their states ('correct', 'present', 'absent', 'unused')
 * @param {boolean} props.disabled - Whether keyboard is disabled
 * @param {boolean} props.visible - Whether keyboard is visible
 */
const VirtualKeyboard = ({
    onLetterPress,
    onBackspace,
    onEnter,
    letterStates = {},
    disabled = false,
    visible = true,
}) => {
    if (!visible) return null;
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
    ];

    const getKeyStyle = (key) => {
        if (key === 'ENTER' || key === 'BACKSPACE') {
            return [styles.key, styles.specialKey, { backgroundColor: THEME_COLORS.keyboardSpecial }];
        }

        const state = letterStates[key] || 'unused';
        let backgroundColor = THEME_COLORS.keyboardDefault;

        // Only gray out letters that are absent (not in word)
        if (state === 'absent') {
            backgroundColor = THEME_COLORS.keyboardDisabled;
        }

        return [styles.key, { backgroundColor }];
    }; const getKeyTextColor = (key) => {
        // Special keys (ENTER/BACKSPACE) always have white text
        if (key === 'ENTER' || key === 'BACKSPACE') {
            return THEME_COLORS.white;
        }

        const state = letterStates[key] || 'unused';

        if (state === 'absent') {
            return THEME_COLORS.textSecondary; // Muted text for disabled keys
        }

        return THEME_COLORS.white;
    };

    const handleKeyPress = (key) => {
        if (disabled) return;

        if (key === 'ENTER') {
            onEnter?.();
        } else if (key === 'BACKSPACE') {
            onBackspace?.();
        } else {
            onLetterPress?.(key);
        }
    };

    const renderKey = (key) => {
        const isSpecialKey = key === 'ENTER' || key === 'BACKSPACE';
        const keyText = key === 'BACKSPACE' ? '⌫' : key;

        return (
            <TouchableOpacity
                key={key}
                onPress={() => handleKeyPress(key)}
                style={getKeyStyle(key)}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.keyText,
                    { color: getKeyTextColor(key) },
                    isSpecialKey && styles.specialKeyText,
                ]}>
                    {keyText}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {keyboardRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map(renderKey)}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: THEME_COLORS.surface,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.md,
        paddingBottom: 34, // Safe area padding for home indicator
        borderTopWidth: 1,
        borderTopColor: THEME_COLORS.border,
        elevation: 1000,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    key: {
        minWidth: 32,
        height: 42,
        borderRadius: BORDER_RADIUS.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    specialKey: {
        minWidth: 60,
        paddingHorizontal: SPACING.xs,
    },
    keyText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    specialKeyText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default VirtualKeyboard;
