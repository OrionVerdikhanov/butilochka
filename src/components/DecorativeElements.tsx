import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Polygon,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface HeartProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

export function Heart({ size = 40, color = '#ff6b9d', animated = true }: HeartProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="heartGradient" cx="50%" cy="40%" r="60%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </RadialGradient>
        </Defs>
        <Path
          d="M 50,85 C 50,85 20,60 20,40 C 20,25 30,15 40,15 C 45,15 50,20 50,20 C 50,20 55,15 60,15 C 70,15 80,25 80,40 C 80,60 50,85 50,85 Z"
          fill="url(#heartGradient)"
        />
        <Path
          d="M 35,30 Q 30,25 35,20"
          stroke="#ffffff"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
      </Svg>
    </Animated.View>
  );
}

interface StarProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

export function Star({ size = 40, color = '#ffd43b', animated = true }: StarProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, rotateAnim, glowAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }, { scale: glowAnim }] }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="starGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffe066" stopOpacity="1" />
            <Stop offset="50%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor="#f59f00" stopOpacity="1" />
          </RadialGradient>
          <RadialGradient id="starGlow" cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {/* Свечение */}
        <Circle cx="50" cy="50" r="45" fill="url(#starGlow)" />
        {/* Звезда */}
        <Polygon
          points="50,10 58,38 88,38 64,56 72,85 50,67 28,85 36,56 12,38 42,38"
          fill="url(#starGradient)"
        />
        {/* Блик */}
        <Circle cx="45" cy="30" r="5" fill="#ffffff" opacity="0.8" />
      </Svg>
    </Animated.View>
  );
}

interface SparkleProps {
  size?: number;
  color?: string;
}

export function Sparkle({ size = 30, color = '#4a90e2' }: SparkleProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="sparkleGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <Stop offset="50%" stopColor={color} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {/* Основной крест */}
        <Path
          d="M 50,20 L 50,80 M 20,50 L 80,50"
          stroke="url(#sparkleGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Диагональный крест */}
        <Path
          d="M 30,30 L 70,70 M 70,30 L 30,70"
          stroke="url(#sparkleGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </Svg>
    </Animated.View>
  );
}

interface BubbleProps {
  size?: number;
  color?: string;
}

export function Bubble({ size = 50, color = '#4ecdc4' }: BubbleProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="bubbleGradient" cx="40%" cy="40%" r="60%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <Stop offset="50%" stopColor={color} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </RadialGradient>
        </Defs>
        {/* Пузырь */}
        <Circle cx="50" cy="50" r="40" fill="url(#bubbleGradient)" />
        {/* Блик большой */}
        <Circle cx="35" cy="35" r="12" fill="#ffffff" opacity="0.7" />
        {/* Блик маленький */}
        <Circle cx="60" cy="45" r="6" fill="#ffffff" opacity="0.5" />
        {/* Обводка */}
        <Circle cx="50" cy="50" r="40" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
      </Svg>
    </Animated.View>
  );
}

interface RibbonProps {
  width?: number;
  height?: number;
  color?: string;
  text?: string;
}

export function Ribbon({ width = 200, height = 60, color = '#ff6b6b' }: RibbonProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 60">
      <Defs>
        <SvgLinearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="50%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </SvgLinearGradient>
      </Defs>
      {/* Основная лента */}
      <Path
        d="M 10,30 L 190,30 L 190,40 L 200,25 L 190,10 L 190,20 L 10,20 L 10,10 L 0,25 L 10,40 Z"
        fill="url(#ribbonGradient)"
      />
      {/* Тень */}
      <Path
        d="M 10,30 L 190,30 L 190,35 L 10,35 Z"
        fill="#000000"
        opacity="0.2"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
