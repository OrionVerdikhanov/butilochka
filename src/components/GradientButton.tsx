import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  title: string;
  onPress: () => void;
  colors?: string[];
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function GradientButton({
  title,
  onPress,
  colors = ['#ff6b6b', '#ee5a6f'],
  disabled = false,
  style,
  textStyle,
}: Props) {
  const handlePress = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ['#999999', '#777777'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
