import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Player, Gender } from '../types';
import GradientBackground from '../components/GradientBackground';
import GradientButton from '../components/GradientButton';
import ScreenHeader from '../components/common/ScreenHeader';
import PlayerInputForm from '../components/players/PlayerInputForm';
import PlayersList from '../components/players/PlayersList';
import { savePlayers, loadPlayers } from '../utils/storage';

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
      const saveData = async () => {
        try {
          await savePlayers(players);
        } catch (error) {
          console.error('Ошибка при сохранении игроков:', error);
          // Можно добавить уведомление пользователя здесь
        }
      };
      saveData();
    }
  }, [players]);

  const addPlayer = useCallback(() => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: name.trim(),
      gender: selectedGender,
      likes: 0,
    };

    setPlayers(prev => [...prev, newPlayer]);
    setName('');
  }, [name, selectedGender]);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleContinue = useCallback(async () => {
    if (players.length < 2) {
      Alert.alert('Ошибка', 'Добавьте минимум 2 игрока');
      return;
    }
    try {
      await savePlayers(players);
      onContinue(players);
    } catch (error) {
      console.error('Ошибка при сохранении игроков:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить игроков. Попробуйте еще раз.');
    }
  }, [players, onContinue]);

  const clearAllPlayers = useCallback(() => {
    setPlayers([]);
  }, []);

  return (
    <GradientBackground colors={['#fff5f5', '#ffe8e8', '#ffd4d4']}>
      <View style={styles.container}>
        <ScreenHeader
          title="Добавление игроков"
          onSettingsPress={onOpenSettings}
        />

        <PlayerInputForm
          name={name}
          selectedGender={selectedGender}
          onNameChange={setName}
          onGenderChange={setSelectedGender}
          onAddPlayer={addPlayer}
        />

        <PlayersList
          players={players}
          onRemovePlayer={removePlayer}
          onClearAll={clearAllPlayers}
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
  continueButton: {
    marginTop: 16,
  },
});