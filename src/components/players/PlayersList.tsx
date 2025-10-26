import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Player } from '../../types';
import { COLORS } from '../../constants/colors';
import PlayerListItem from './PlayerListItem';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface PlayersListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
  onClearAll: () => void;
}

const PlayersList = React.memo(({ players, onRemovePlayer, onClearAll }: PlayersListProps) => {
  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Удалить всех?',
      'Вы уверены, что хотите удалить всех игроков?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            ReactNativeHapticFeedback.trigger('notificationWarning');
            onClearAll();
          },
        },
      ]
    );
  }, [onClearAll]);

  const renderItem = useCallback(({ item, index }: { item: Player; index: number }) => (
    <PlayerListItem
      player={item}
      index={index}
      onRemove={onRemovePlayer}
    />
  ), [onRemovePlayer]);

  const keyExtractor = useCallback((item: Player) => item.id, []);

  return (
    <>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          Игроки: {players.length}
        </Text>
        {players.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Очистить все</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={players}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Добавьте минимум 2 игрока для начала игры
            </Text>
          </View>
        }
      />
    </>
  );
});

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearButton: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});

PlayersList.displayName = 'PlayersList';

export default PlayersList;