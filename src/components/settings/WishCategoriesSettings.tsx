import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { WishCategory, CATEGORY_NAMES, CATEGORY_EMOJIS } from '../../constants/wishes';
import { Settings } from '../../utils/storage';

interface Props {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

/**
 * Компонент настроек категорий желаний
 */
export function WishCategoriesSettings({ settings, onSettingsChange }: Props) {
  const categories: WishCategory[] = ['all', 'funny', 'romantic', 'extreme', 'creative', 'social'];

  const getCategoryColor = (category: WishCategory): string[] => {
    switch (category) {
      case 'all':
        return ['#667eea', '#764ba2'];
      case 'funny':
        return ['#f093fb', '#f5576c'];
      case 'romantic':
        return ['#fa709a', '#fee140'];
      case 'extreme':
        return ['#ff6b6b', '#ee5a6f'];
      case 'creative':
        return ['#4facfe', '#00f2fe'];
      case 'social':
        return ['#43e97b', '#38f9d7'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const toggleCategory = (category: WishCategory) => {
    ReactNativeHapticFeedback.trigger('impactLight');

    if (category === 'all') {
      onSettingsChange({ ...settings, enabledCategories: ['all'] });
      return;
    }

    const isEnabled = settings.enabledCategories.includes(category);
    let newCategories: WishCategory[];

    if (isEnabled) {
      newCategories = settings.enabledCategories.filter(c => c !== category && c !== 'all');
      if (newCategories.length === 0) {
        newCategories = ['all'];
      }
    } else {
      newCategories = settings.enabledCategories.filter(c => c !== 'all');
      newCategories.push(category);
    }

    onSettingsChange({ ...settings, enabledCategories: newCategories });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎯 Категории желаний</Text>
      <Text style={styles.sectionDescription}>
        Выберите какие желания будут использоваться в игре
      </Text>

      <View style={styles.categoriesGrid}>
        {categories.map(category => {
          const isEnabled = settings.enabledCategories.includes(category) ||
                           settings.enabledCategories.includes('all');
          const isAll = category === 'all';
          const isAllSelected = settings.enabledCategories.includes('all');

          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryCard}
              onPress={() => toggleCategory(category)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  isEnabled || (isAllSelected && !isAll)
                    ? getCategoryColor(category)
                    : ['#e9ecef', '#dee2e6']
                }
                style={[
                  styles.categoryGradient,
                  (isEnabled || (isAllSelected && !isAll)) && styles.categoryEnabled,
                ]}
              >
                <Text style={styles.categoryEmoji}>{CATEGORY_EMOJIS[category]}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    !(isEnabled || (isAllSelected && !isAll)) && styles.categoryTextDisabled,
                  ]}
                >
                  {CATEGORY_NAMES[category]}
                </Text>
                {(isEnabled && !isAll) || (isAll && isAllSelected) ? (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                ) : null}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    opacity: 0.7,
  },
  categoryEnabled: {
    opacity: 1,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  categoryTextDisabled: {
    color: '#6b7280',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
});