import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundPattern from './BackgroundPattern';

const { width, height } = Dimensions.get('window');

export type BackgroundTheme =
  | 'romantic'
  | 'party'
  | 'ocean'
  | 'sunset'
  | 'galaxy'
  | 'forest'
  | 'neon'
  | 'pastel';

interface Props {
  theme: BackgroundTheme;
  children: React.ReactNode;
}

const THEME_CONFIGS = {
  romantic: {
    colors: ['#fff0f6', '#ffe0f0', '#ffc9ea', '#ff99d8'],
    pattern: 'hearts' as const,
    patternOpacity: 0.15,
  },
  party: {
    colors: ['#fff9db', '#fff3bf', '#ffe066', '#ffd43b'],
    pattern: 'confetti' as const,
    patternOpacity: 0.2,
  },
  ocean: {
    colors: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6'],
    pattern: 'waves' as const,
    patternOpacity: 0.25,
  },
  sunset: {
    colors: ['#fff4e6', '#ffe8cc', '#ffd8a8', '#ffc078'],
    pattern: 'circles' as const,
    patternOpacity: 0.1,
  },
  galaxy: {
    colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483'],
    pattern: 'stars' as const,
    patternOpacity: 0.3,
  },
  forest: {
    colors: ['#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581'],
    pattern: 'circles' as const,
    patternOpacity: 0.12,
  },
  neon: {
    colors: ['#2d1b69', '#6a1b9a', '#8e24aa', '#ab47bc'],
    pattern: 'geometric' as const,
    patternOpacity: 0.18,
  },
  pastel: {
    colors: ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292'],
    pattern: 'stars' as const,
    patternOpacity: 0.08,
  },
};

export default function AnimatedBackground({ theme, children }: Props) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const config = THEME_CONFIGS[theme];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  // Создаем легкий эффект мерцания для некоторых тем
  const animatedColors = config.colors.map((color, index) => {
    if (theme === 'galaxy' || theme === 'neon') {
      return shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [color, adjustBrightness(color, 1.1), color],
      });
    }
    return color;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={config.colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <BackgroundPattern
        pattern={config.pattern}
        opacity={config.patternOpacity}
      />

      {/* Overlay для дополнительной глубины */}
      <View style={styles.overlay} />

      {children}
    </View>
  );
}

// Вспомогательная функция для изменения яркости цвета
function adjustBrightness(color: string, factor: number): string {
  // Простая реализация - в реальном проекте лучше использовать библиотеку
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.floor(r * factor));
  const newG = Math.min(255, Math.floor(g * factor));
  const newB = Math.min(255, Math.floor(b * factor));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
});
