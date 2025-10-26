import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Ellipse, Circle, Path, Line } from 'react-native-svg';
import { COLORS } from '../constants/colors';

interface Props {
  rotation: Animated.Value;
  isSpinning: boolean;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function Bottle({ rotation, isSpinning }: Props) {
  // Используем динамическую интерполяцию с экстраполяцией для корректного отображения любых значений
  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend', // Позволяет корректно обрабатывать значения за пределами диапазона
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

          {/* Улучшенная стрелка указателя направления - больше и контрастнее */}
          <Path d="M 60 0 L 35 30 L 48 30 L 48 40 L 72 40 L 72 30 L 85 30 Z" fill="#000000" stroke="#ffffff" strokeWidth="2" />
          {/* Яркая градиентная заливка для стрелки */}
          <Defs>
            <LinearGradient id="arrowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
              <Stop offset="100%" stopColor="#ffff00" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path d="M 60 3 L 40 28 L 50 28 L 50 37 L 70 37 L 70 28 L 80 28 Z" fill="url(#arrowGrad)" />
          {/* Центральная линия для максимальной наглядности - толще и ярче */}
          <Line x1="60" y1="40" x2="60" y2="180" stroke="#ff0000" strokeWidth="4" opacity="0.7" />
          <Line x1="60" y1="40" x2="60" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.9" />

          {/* Горлышко бутылки */}
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
