import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface ColorSelectorProps {
  label: string;
  options: Array<{ value: string; label: string; colors?: string[] }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  renderItem?: (item: any, isSelected: boolean) => React.ReactNode;
}

export default function ColorSelector({
  label,
  options,
  selectedValue,
  onSelect,
  renderItem,
}: ColorSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          if (renderItem) {
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => onSelect(option.value)}
                activeOpacity={0.7}
              >
                {renderItem(option, isSelected)}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 12,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionTextSelected: {
    color: '#ffffff',
  },
});
