import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Text, Card, Button } from '../atoms';
import { formatTime } from '../../utils/gameUtils';
import { useThemeColors } from '../../hooks/useThemeColors';
import { SPACING, FONT_SIZES } from '../../constants';

/**
 * Leaderboard organism component for displaying top scores
 * @param {Object} props - Leaderboard props
 * @param {Array} props.data - Leaderboard data array
 * @param {boolean} props.loading - Whether data is loading
 * @param {Function} props.onRefresh - Callback for refresh action
 * @param {string} props.currentUserId - Current user's ID for highlighting
 * @param {number} props.maxEntries - Maximum entries to show
 */
const Leaderboard = ({
    data = [],
    loading = false,
    onRefresh,
    currentUserId,
    maxEntries = 10,
}) => {
    const [refreshing, setRefreshing] = useState(false);
    const THEME_COLORS = useThemeColors();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            maxHeight: 500,
        },
        header: {
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.md,
            backgroundColor: THEME_COLORS.light,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
        },
        subtitle: {
            marginTop: SPACING.xs,
            opacity: 0.7,
        },
        content: {
            flex: 1,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: SPACING.xl,
            paddingHorizontal: SPACING.lg,
        },
        emptyTitle: {
            marginBottom: SPACING.md,
        },
        emptyText: {
            marginBottom: SPACING.lg,
            opacity: 0.7,
            textAlign: 'center',
        },
        refreshButton: {
            marginTop: SPACING.md,
        },
        scrollContainer: {
            flex: 1,
        },
        dataTable: {
            backgroundColor: THEME_COLORS.white,
        },
        tableHeader: {
            backgroundColor: THEME_COLORS.primary,
            paddingVertical: SPACING.sm,
        },
        headerText: {
            color: THEME_COLORS.white,
            fontWeight: '600',
            fontSize: FONT_SIZES.sm,
        },
        tableRow: {
            borderBottomWidth: 1,
            borderBottomColor: THEME_COLORS.letterBoxBorder,
            paddingVertical: SPACING.xs,
        },
        currentUserRow: {
            backgroundColor: THEME_COLORS.light,
            borderBottomColor: THEME_COLORS.primary,
            borderBottomWidth: 2,
        },
        rankCell: {
            flex: 0.8,
            justifyContent: 'center',
        },
        nameCell: {
            flex: 2,
            justifyContent: 'center',
        },
        attemptsCell: {
            flex: 1,
            justifyContent: 'center',
        },
        timeCell: {
            flex: 1,
            justifyContent: 'center',
        },
    });

    const handleRefresh = async () => {
        if (onRefresh) {
            setRefreshing(true);
            await onRefresh();
            setRefreshing(false);
        }
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text variant="h4" color="dark" align="center" style={styles.emptyTitle}>
                🏆 Leaderboard
            </Text>
            <Text variant="body2" color="dark" align="center" style={styles.emptyText}>
                No scores yet. Be the first to complete a level!
            </Text>
            {onRefresh && (
                <Button
                    mode="outlined"
                    variant="primary"
                    onPress={handleRefresh}
                    style={styles.refreshButton}
                    loading={loading}
                >
                    Check for Updates
                </Button>
            )}
        </View>
    );

    const renderLeaderboard = () => {
        const displayData = data.slice(0, maxEntries);

        return (
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[THEME_COLORS.primary]}
                        />
                    ) : undefined
                }
            >
                <DataTable style={styles.dataTable}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title textStyle={styles.headerText}>Rank</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText}>Player</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText} numeric>Attempts</DataTable.Title>
                        <DataTable.Title textStyle={styles.headerText} numeric>Time</DataTable.Title>
                    </DataTable.Header>

                    {displayData.map((entry, index) => {
                        const isCurrentUser = entry.userId === currentUserId;
                        const rank = index + 1;
                        const getRankEmoji = (rank) => {
                            switch (rank) {
                                case 1: return '🥇';
                                case 2: return '🥈';
                                case 3: return '🥉';
                                default: return `${rank}`;
                            }
                        };

                        return (
                            <DataTable.Row
                                key={`${entry.userId}-${entry.createdAt}`}
                                style={[
                                    styles.tableRow,
                                    isCurrentUser && styles.currentUserRow
                                ]}
                            >
                                <DataTable.Cell style={styles.rankCell}>
                                    <Text
                                        variant="body2"
                                        weight="600"
                                        color={rank <= 3 ? 'primary' : 'dark'}
                                    >
                                        {getRankEmoji(rank)}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.nameCell}>
                                    <Text
                                        variant="body2"
                                        weight={isCurrentUser ? '600' : '400'}
                                        color={isCurrentUser ? 'primary' : 'dark'}
                                        numberOfLines={1}
                                    >
                                        {entry.username}
                                        {isCurrentUser && ' (You)'}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell numeric style={styles.attemptsCell}>
                                    <Text
                                        variant="body2"
                                        weight="500"
                                        color="dark"
                                    >
                                        {entry.attempts}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell numeric style={styles.timeCell}>
                                    <Text
                                        variant="body2"
                                        weight="400"
                                        color="dark"
                                    >
                                        {formatTime(entry.timeMs)}
                                    </Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </ScrollView>
        );
    };

    return (
        <Card variant="elevated" padding="none" style={styles.container}>
            <View style={styles.header}>
                <Text variant="h3" color="primary" weight="600" align="center">
                    🏆 Top Players
                </Text>
                {data.length > 0 && (
                    <Text variant="caption" color="dark" align="center" style={styles.subtitle}>
                        Showing top {Math.min(data.length, maxEntries)} players
                    </Text>
                )}
            </View>

            <View style={styles.content}>
                {data.length === 0 ? renderEmptyState() : renderLeaderboard()}
            </View>
        </Card>
    );
};

export default Leaderboard;
