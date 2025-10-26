import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WishCategory } from '../../constants/wishes';

interface CategoryToggleProps {
  category: WishCategory;
  name: string;
  emoji: string;
  colors: string[];
  isEnabled: boolean;
  onToggle: () => void;
}

export default function CategoryToggle({
  category,
  name,
  emoji,
  colors,
  isEnabled,
  onToggle,
}: CategoryToggleProps) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <LinearGradient
        colors={isEnabled ? colors : ['#e9ecef', '#dee2e6']}
        style={styles.card}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.name, !isEnabled && styles.nameDisabled]}>
          {name}
        </Text>
        {isEnabled && <Text style={styles.check}>✓</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  nameDisabled: {
    color: '#868e96',
  },
  check: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
