import React, { useState } from 'react';
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

interface Props {
  onContinue: (players: Player[]) => void;
}

export default function PlayersScreen({ onContinue }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender>('M');

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

    setPlayers([...players, newPlayer]);
    setName('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleContinue = () => {
    if (players.length < 2) {
      Alert.alert('Ошибка', 'Добавьте минимум 2 игрока');
      return;
    }
    onContinue(players);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добавление игроков</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Имя игрока"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.textLight}
        />

        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'M' && styles.genderButtonMale,
            ]}
            onPress={() => setSelectedGender('M')}
          >
            <Text style={[
              styles.genderButtonText,
              selectedGender === 'M' && styles.genderButtonTextActive,
            ]}>
              М
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'F' && styles.genderButtonFemale,
            ]}
            onPress={() => setSelectedGender('F')}
          >
            <Text style={[
              styles.genderButtonText,
              selectedGender === 'F' && styles.genderButtonTextActive,
            ]}>
              Ж
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={players}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.playerItem}>
            <View style={[
              styles.genderIndicator,
              { backgroundColor: item.gender === 'M' ? COLORS.male : COLORS.female }
            ]} />
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerGender}>({item.gender})</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePlayer(item.id)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {players.length >= 2 && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>
            Продолжить ({players.length} игроков)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  genderButtonMale: {
    backgroundColor: COLORS.male,
    borderColor: COLORS.male,
  },
  genderButtonFemale: {
    backgroundColor: COLORS.female,
    borderColor: COLORS.female,
  },
  genderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  genderButtonTextActive: {
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  genderIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
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
    marginRight: 10,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: COLORS.success,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
