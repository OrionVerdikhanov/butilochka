import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Ellipse, Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';

interface Props {
  rotation: Animated.Value;
  isSpinning: boolean;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function Bottle({ rotation, isSpinning }: Props) {
  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bottle,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Svg width="120" height="200" viewBox="0 0 120 200">
          <Defs>
            <LinearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
              <Stop offset="50%" stopColor="#ee5a6f" stopOpacity="1" />
              <Stop offset="100%" stopColor="#d63447" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>

          {/* Горлышко бутылки (стрелка) */}
          <Rect x="48" y="10" width="24" height="70" rx="12" fill="url(#bottleGrad)" />
          <Rect x="50" y="12" width="8" height="66" rx="4" fill="url(#glassGrad)" />

          {/* Тело бутылки */}
          <Ellipse cx="60" cy="100" rx="40" ry="80" fill="url(#bottleGrad)" />
          <Ellipse cx="55" cy="90" rx="15" ry="40" fill="url(#glassGrad)" />

          {/* Блики */}
          <Circle cx="70" cy="60" r="8" fill="white" opacity="0.4" />
          <Circle cx="75" cy="120" r="6" fill="white" opacity="0.3" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottle: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
