import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { Text, Button, Card, TextInput } from '../atoms';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING, BORDER_RADIUS } from '../../constants';

/**
 * AlertModal molecule component for displaying alerts and messages
 * @param {Object} props - AlertModal props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Function} props.onDismiss - Callback when modal is dismissed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.type - Alert type (success, error, warning, info, input)
 * @param {Array} props.actions - Array of action buttons
 * @param {string} props.inputValue - Value for input field (when type is 'input')
 * @param {Function} props.onInputChange - Callback for input changes
 * @param {string} props.inputPlaceholder - Placeholder for input field
 */
const AlertModal = ({
    visible = false,
    onDismiss,
    title,
    message,
    type = 'info',
    actions = [],
    inputValue = '',
    onInputChange,
    inputPlaceholder = '',
}) => {
    const THEME_COLORS = useThemeColors();

    const getTypeColor = () => {
        switch (type) {
            case 'success':
                return THEME_COLORS.success;
            case 'error':
                return THEME_COLORS.danger;
            case 'warning':
                return THEME_COLORS.warning;
            case 'info':
            default:
                return THEME_COLORS.primary;
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
            default:
                return 'ℹ️';
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.container}
            >
                <Card variant="elevated" padding="large" style={styles.modal}>
                    <View style={styles.header}>
                        <Text variant="h4" style={[styles.icon, { color: getTypeColor() }]}>
                            {getTypeIcon()}
                        </Text>
                        {title && (
                            <Text variant="h3" color="dark" weight="600" align="center">
                                {title}
                            </Text>
                        )}
                    </View>

                    {message && (
                        <View style={styles.content}>
                            <Text variant="body1" color="dark" align="center">
                                {message}
                            </Text>
                        </View>
                    )}

                    {type === 'input' && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={inputValue}
                                onChangeText={onInputChange}
                                placeholder={inputPlaceholder}
                                autoFocus={true}
                                style={styles.input}
                            />
                        </View>
                    )}

                    <View style={styles.actions}>
                        {actions.length > 0 ? (
                            actions.map((action, index) => (
                                <Button
                                    key={index}
                                    mode={action.primary ? 'contained' : 'outlined'}
                                    variant={action.variant || type}
                                    onPress={action.onPress}
                                    style={styles.actionButton}
                                >
                                    {action.label}
                                </Button>
                            ))
                        ) : (
                            <Button
                                mode="contained"
                                variant={type}
                                onPress={onDismiss}
                                fullWidth
                            >
                                OK
                            </Button>
                        )}
                    </View>
                </Card>
            </Modal>
        </Portal>
    );
};

/**
 * ConfirmModal molecule component for confirmation dialogs
 * @param {Object} props - ConfirmModal props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {Function} props.onDismiss - Callback when modal is dismissed
 * @param {Function} props.onConfirm - Callback when user confirms
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {string} props.variant - Button variant for confirm action
 */
const ConfirmModal = ({
    visible = false,
    onDismiss,
    onConfirm,
    title = 'Confirm',
    message = 'Are you sure?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
}) => {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.container}
            >
                <Card variant="elevated" padding="large" style={styles.modal}>
                    <View style={styles.header}>
                        <Text variant="h3" color="dark" weight="600" align="center">
                            {title}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <Text variant="body1" color="dark" align="center">
                            {message}
                        </Text>
                    </View>

                    <View style={styles.confirmActions}>
                        <Button
                            mode="outlined"
                            variant="secondary"
                            onPress={onDismiss}
                            style={styles.confirmButton}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            mode="contained"
                            variant={variant}
                            onPress={onConfirm}
                            style={styles.confirmButton}
                        >
                            {confirmText}
                        </Button>
                    </View>
                </Card>
            </Modal>
        </Portal>
    );
};

/**
 * LoadingModal molecule component for loading states
 * @param {Object} props - LoadingModal props
 * @param {boolean} props.visible - Whether modal is visible
 * @param {string} props.message - Loading message
 */
const LoadingModal = ({
    visible = false,
    message = 'Loading...',
}) => {
    return (
        <Portal>
            <Modal
                visible={visible}
                dismissable={false}
                contentContainerStyle={styles.container}
            >
                <Card variant="elevated" padding="large" style={styles.loadingModal}>
                    <View style={styles.loadingContent}>
                        <Text variant="body1" color="dark" align="center">
                            {message}
                        </Text>
                    </View>
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '100%',
        maxWidth: 400,
    },
    loadingModal: {
        width: '80%',
        maxWidth: 300,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    icon: {
        fontSize: 32,
        marginBottom: SPACING.sm,
    },
    content: {
        marginBottom: SPACING.lg,
    },
    inputContainer: {
        marginBottom: SPACING.lg,
        width: '100%',
    },
    input: {
        marginBottom: SPACING.sm,
    },
    actions: {
        gap: SPACING.sm,
    },
    actionButton: {
        marginBottom: SPACING.xs,
    },
    confirmActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    confirmButton: {
        flex: 1,
    },
    loadingContent: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
});

export { AlertModal, ConfirmModal, LoadingModal };
