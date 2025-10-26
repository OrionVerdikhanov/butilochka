import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface ScreenHeaderProps {
  title: string;
  onSettingsPress?: () => void;
}

const ScreenHeader = React.memo(({ title, onSettingsPress }: ScreenHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      {onSettingsPress && (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactMedium');
            onSettingsPress();
          }}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
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
});

ScreenHeader.displayName = 'ScreenHeader';

export default ScreenHeader;