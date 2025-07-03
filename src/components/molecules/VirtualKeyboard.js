import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS } from '../../constants';

/**
 * Virtual Keyboard molecule component
 * @param {Object} props - VirtualKeyboard props
 * @param {Function} props.onLetterPress - Callback when letter is pressed
 * @param {Function} props.onBackspace - Callback when backspace is pressed
 * @param {Function} props.onEnter - Callback when enter is pressed
 * @param {Object} props.letterStates - Object mapping letters to their states ('correct', 'present', 'absent', 'unused')
 * @param {boolean} props.disabled - Whether keyboard is disabled
 * @param {boolean} props.visible - Whether keyboard is visible
 * @param {Object} props.themeColors - Theme colors object
 */
const VirtualKeyboard = ({
    onLetterPress,
    onBackspace,
    onEnter,
    letterStates = {},
    disabled = false,
    visible = true,
    themeColors = null,
}) => {
    const themeColorsFromHook = useThemeColors();
    const effectiveThemeColors = themeColors || themeColorsFromHook;

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: effectiveThemeColors.surface,
            paddingHorizontal: SPACING.sm,
            paddingVertical: SPACING.md,
            paddingBottom: 34, // Safe area padding for home indicator
            borderTopWidth: 1,
            borderTopColor: effectiveThemeColors.border,
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

    if (!visible) return null;
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
    ];

    const getKeyStyle = (key) => {
        if (key === 'ENTER' || key === 'BACKSPACE') {
            return [styles.key, styles.specialKey, { backgroundColor: effectiveThemeColors.keyboardSpecial }];
        }

        const state = letterStates[key] || 'unused';
        let backgroundColor = effectiveThemeColors.keyboardDefault;

        // Apply different colors based on letter state
        switch (state) {
            case 'correct':
                backgroundColor = effectiveThemeColors.scoreGreen;
                break;
            case 'present':
                backgroundColor = effectiveThemeColors.scoreYellow;
                break;
            case 'absent':
                backgroundColor = effectiveThemeColors.keyboardDisabled;
                break;
            default:
                backgroundColor = effectiveThemeColors.keyboardDefault;
        }

        return [styles.key, { backgroundColor }];
    }; const getKeyTextColor = (key) => {
        // Special keys (ENTER/BACKSPACE) always have white text
        if (key === 'ENTER' || key === 'BACKSPACE') {
            return effectiveThemeColors.white;
        }

        const state = letterStates[key] || 'unused';

        // Use white text for colored keys (correct/present), muted text for disabled keys
        switch (state) {
            case 'correct':
            case 'present':
                return effectiveThemeColors.white;
            case 'absent':
                return effectiveThemeColors.textSecondary; // Muted text for disabled keys
            default:
                return effectiveThemeColors.white;
        }
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

    return (
        <View style={styles.container}>
            {keyboardRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((key) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                getKeyStyle(key),
                                disabled && { opacity: 0.5 }
                            ]}
                            onPress={() => handleKeyPress(key)}
                            disabled={disabled}
                        >
                            <Text style={[
                                styles.keyText,
                                { color: getKeyTextColor(key) },
                                (key === 'ENTER' || key === 'BACKSPACE') && styles.specialKeyText,
                            ]}>
                                {key === 'BACKSPACE' ? '⌫' : key}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

export default VirtualKeyboard;
