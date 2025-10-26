import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface SliderSettingProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onValueChange: (value: number) => void;
}

export default function SliderSetting({
  label,
  value,
  min,
  max,
  step,
  unit,
  onValueChange,
}: SliderSettingProps) {
  const options = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value / 1000}{unit}</Text>
      </View>
      <View style={styles.buttons}>
        {options.map((option) => (
          <Text
            key={option}
            style={[
              styles.button,
              option === value && styles.buttonActive,
            ]}
            onPress={() => onValueChange(option)}
          >
            {option / 1000}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f1f3f5',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    overflow: 'hidden',
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    color: '#ffffff',
  },
});
