import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  Path,
  Ellipse,
  Circle,
  G,
} from 'react-native-svg';

interface Props {
  rotation: Animated.Value;
  isSpinning: boolean;
}

export default function BottlePremium({ rotation, isSpinning }: Props) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSpinning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isSpinning]);

  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Свечение при вращении */}
      {isSpinning && (
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
            },
          ]}
        />
      )}

      <Animated.View
        style={[
          styles.bottle,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Svg width="140" height="220" viewBox="0 0 140 220">
          <Defs>
            {/* Градиенты для стекла */}
            <SvgLinearGradient id="glassMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#ff8787" stopOpacity="0.95" />
              <Stop offset="50%" stopColor="#ff6b6b" stopOpacity="0.98" />
              <Stop offset="100%" stopColor="#d63447" stopOpacity="1" />
            </SvgLinearGradient>

            <SvgLinearGradient id="glassHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
              <Stop offset="50%" stopColor="#ffe8e8" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
            </SvgLinearGradient>

            <RadialGradient id="glassReflection" cx="50%" cy="30%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </RadialGradient>

            {/* Тень */}
            <RadialGradient id="shadow" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Тень под бутылкой */}
          <Ellipse cx="70" cy="210" rx="45" ry="8" fill="url(#shadow)" />

          <G>
            {/* Горлышко бутылки (стрелка) */}
            {/* Основа горлышка */}
            <Path
              d="M 58 15 Q 58 10, 60 8 L 80 8 Q 82 10, 82 15 L 82 85 Q 82 90, 78 92 L 62 92 Q 58 90, 58 85 Z"
              fill="url(#glassMain)"
            />

            {/* Блик на горлышке */}
            <Path
              d="M 60 10 Q 60 10, 61 12 L 61 85 Q 61 88, 63 90 L 68 90 Q 70 88, 70 85 L 70 12 Q 70 10, 70 10 Z"
              fill="url(#glassHighlight)"
              opacity="0.6"
            />

            {/* Тело бутылки */}
            {/* Основное тело */}
            <Path
              d="M 35 95 Q 30 95, 30 100 L 30 180 Q 30 190, 35 195 L 105 195 Q 110 190, 110 180 L 110 100 Q 110 95, 105 95 Z"
              fill="url(#glassMain)"
            />

            {/* Блик на теле */}
            <Ellipse
              cx="60"
              cy="130"
              rx="20"
              ry="50"
              fill="url(#glassHighlight)"
              opacity="0.5"
            />

            {/* Общий блик/отражение */}
            <Ellipse
              cx="65"
              cy="120"
              rx="35"
              ry="70"
              fill="url(#glassReflection)"
            />

            {/* Дополнительные блики для реалистичности */}
            <Circle cx="75" cy="40" r="10" fill="white" opacity="0.5" />
            <Circle cx="85" cy="140" r="15" fill="white" opacity="0.3" />
            <Circle cx="60" cy="170" r="8" fill="white" opacity="0.4" />

            {/* Мелкие блики */}
            <Circle cx="90" cy="110" r="5" fill="white" opacity="0.6" />
            <Circle cx="50" cy="150" r="6" fill="white" opacity="0.5" />
            <Circle cx="95" cy="170" r="4" fill="white" opacity="0.7" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ff6b6b',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  bottle: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
});
