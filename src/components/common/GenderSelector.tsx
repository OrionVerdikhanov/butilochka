import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Gender } from '../../types';
import { COLORS } from '../../constants/colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface GenderSelectorProps {
  selectedGender: Gender;
  onGenderChange: (gender: Gender) => void;
}

const GenderSelector = React.memo(({ selectedGender, onGenderChange }: GenderSelectorProps) => {
  const handleGenderSelect = (gender: Gender) => {
    ReactNativeHapticFeedback.trigger('selection');
    onGenderChange(gender);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.genderButton,
          selectedGender === 'M' && styles.genderButtonMaleActive,
        ]}
        onPress={() => handleGenderSelect('M')}
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
        onPress={() => handleGenderSelect('F')}
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
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});

GenderSelector.displayName = 'GenderSelector';

export default GenderSelector;