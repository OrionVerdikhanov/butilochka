import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Player, Gender } from '../types';
import { COLORS } from '../constants/colors';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import { savePlayers, loadPlayers } from '../utils/storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  onContinue: (players: Player[]) => void;
  onOpenSettings?: () => void;
}

export default function PlayersScreen({ onContinue, onOpenSettings }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender>('M');

  // Загрузка сохраненных игроков
  useEffect(() => {
    const loadSavedPlayers = async () => {
      const saved = await loadPlayers();
      if (saved.length > 0) {
        Alert.alert(
          'Загрузить игроков?',
          `Найдено ${saved.length} сохраненных игроков. Загрузить их?`,
          [
            { text: 'Нет', style: 'cancel' },
            {
              text: 'Да',
              onPress: () => setPlayers(saved),
            },
          ]
        );
      }
    };
    loadSavedPlayers();
  }, []);

  // Автосохранение при изменении
  useEffect(() => {
    if (players.length > 0) {
      savePlayers(players);
    }
  }, [players]);

  const addPlayer = () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите имя игрока');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: name.trim(),
      gender: selectedGender,
      likes: 0,
    };

    ReactNativeHapticFeedback.trigger('impactLight');
    setPlayers([...players, newPlayer]);
    setName('');
  };

  const removePlayer = (id: string) => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleContinue = () => {
    if (players.length < 2) {
      Alert.alert('Ошибка', 'Добавьте минимум 2 игрока');
      return;
    }
    savePlayers(players);
    onContinue(players);
  };

  const clearAllPlayers = () => {
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
            setPlayers([]);
          },
        },
      ]
    );
  };

  return (
    <GradientBackground colors={['#fff5f5', '#ffe8e8', '#ffd4d4']}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Добавление игроков</Text>
          {onOpenSettings && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {
                ReactNativeHapticFeedback.trigger('impactMedium');
                onOpenSettings();
              }}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Имя игрока"
            value={name}
            onChangeText={setName}
            placeholderTextColor={COLORS.textLight}
            onSubmitEditing={addPlayer}
            returnKeyType="done"
          />

          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                selectedGender === 'M' && styles.genderButtonMaleActive,
              ]}
              onPress={() => {
                ReactNativeHapticFeedback.trigger('selection');
                setSelectedGender('M');
              }}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  selectedGender === 'M' && styles.genderButtonTextActive,
                ]}
              >
                Мужчина
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                selectedGender === 'F' && styles.genderButtonFemaleActive,
              ]}
              onPress={() => {
                ReactNativeHapticFeedback.trigger('selection');
                setSelectedGender('F');
              }}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  selectedGender === 'F' && styles.genderButtonTextActive,
                ]}
              >
                Женщина
              </Text>
            </TouchableOpacity>
          </View>

          <GradientButton
            title="+ Добавить игрока"
            onPress={addPlayer}
            colors={['#4ecdc4', '#44a3d9']}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Игроки: {players.length}
          </Text>
          {players.length > 0 && (
            <TouchableOpacity onPress={clearAllPlayers}>
              <Text style={styles.clearButton}>Очистить все</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={players}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <View style={styles.playerItem}>
              <View style={styles.playerNumber}>
                <Text style={styles.playerNumberText}>{index + 1}</Text>
              </View>
              <View
                style={[
                  styles.genderIndicator,
                  {
                    backgroundColor:
                      item.gender === 'M' ? COLORS.male : COLORS.female,
                  },
                ]}
              />
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerGender}>
                ({item.gender === 'M' ? 'М' : 'Ж'})
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePlayer(item.id)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Добавьте минимум 2 игрока для начала игры
              </Text>
            </View>
          }
        />

        {players.length >= 2 && (
          <GradientButton
            title={`Продолжить (${players.length} игроков)`}
            onPress={handleContinue}
            colors={['#51cf66', '#37b24d']}
            style={styles.continueButton}
          />
        )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButtonText: {
    fontSize: 24,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  genderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  genderButtonMaleActive: {
    backgroundColor: COLORS.male,
    borderColor: COLORS.male,
  },
  genderButtonFemaleActive: {
    backgroundColor: COLORS.female,
    borderColor: COLORS.female,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  genderButtonTextActive: {
    color: COLORS.white,
  },
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
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  genderIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  playerGender: {
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: 12,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
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
  continueButton: {
    marginTop: 16,
  },
});
