import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface ToggleSettingProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ToggleSetting({
  label,
  value,
  onValueChange,
}: ToggleSettingProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: COLORS.primary }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});
