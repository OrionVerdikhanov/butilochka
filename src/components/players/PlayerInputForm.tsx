import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Gender } from '../../types';
import { COLORS } from '../../constants/colors';
import GradientButton from '../../components/GradientButton';
import GenderSelector from '../common/GenderSelector';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface PlayerInputFormProps {
  name: string;
  selectedGender: Gender;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: Gender) => void;
  onAddPlayer: () => void;
}

const PlayerInputForm = React.memo(({
  name,
  selectedGender,
  onNameChange,
  onGenderChange,
  onAddPlayer
}: PlayerInputFormProps) => {
  const handleSubmit = useCallback(() => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите имя игрока');
      return;
    }
    ReactNativeHapticFeedback.trigger('impactLight');
    onAddPlayer();
  }, [name, onAddPlayer]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Имя игрока"
        value={name}
        onChangeText={onNameChange}
        placeholderTextColor={COLORS.textLight}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      <GenderSelector
        selectedGender={selectedGender}
        onGenderChange={onGenderChange}
      />

      <GradientButton
        title="+ Добавить игрока"
        onPress={handleSubmit}
        colors={['#4ecdc4', '#44a3d9']}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
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
});

PlayerInputForm.displayName = 'PlayerInputForm';

export default PlayerInputForm;