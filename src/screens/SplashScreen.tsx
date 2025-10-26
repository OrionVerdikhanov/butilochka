import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);

  useEffect(() => {
    // Анимация появления
    const fadeInAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);

    // Анимация вращения
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    // Анимация свечения
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Запуск анимаций
    fadeInAnimation.start();
    rotationAnimation.start();
    glowAnimation.start();

    // Завершение через 2.5 секунды
    const timer = setTimeout(() => {
      if (isMounted.current) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (isMounted.current) {
            onFinish();
          }
        });
      }
    }, 2500);

    // Очистка при размонтировании
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
      rotationAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <LinearGradient
      colors={['#ff6b6b', '#ee5a6f', '#d63447']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Фоновые частицы */}
      <View style={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: Math.random() * 0.5,
              },
            ]}
          />
        ))}
      </View>

      {/* Главный контент */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Свечение позади иконки */}
        <Animated.View
          style={[
            styles.glow,
            {
              transform: [{ scale: glowScale }],
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Иконка бутылочки */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Svg width="200" height="300" viewBox="0 0 120 200">
            <Defs>
              <SvgLinearGradient id="bottleGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <Stop offset="50%" stopColor="#ffe8e8" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#ffd4d4" stopOpacity="0.8" />
              </SvgLinearGradient>
            </Defs>

            {/* Горлышко */}
            <Path
              d="M 48 10 Q 48 10, 48 20 L 48 80 Q 48 85, 53 88 L 67 88 Q 72 85, 72 80 L 72 20 Q 72 10, 72 10 Z"
              fill="url(#bottleGloss)"
              opacity="0.95"
            />

            {/* Тело */}
            <Path
              d="M 30 90 Q 30 85, 35 85 L 85 85 Q 90 85, 90 90 L 90 170 Q 90 180, 85 180 L 35 180 Q 30 180, 30 170 Z"
              fill="url(#bottleGloss)"
              opacity="0.95"
            />

            {/* Блики */}
            <Circle cx="50" cy="30" r="8" fill="white" opacity="0.6" />
            <Circle cx="70" cy="120" r="12" fill="white" opacity="0.4" />
            <Circle cx="55" cy="150" r="6" fill="white" opacity="0.5" />
          </Svg>
        </Animated.View>

        {/* Название */}
        <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Бутылочка</Text>
          <Text style={styles.subtitle}>Игра для компании</Text>
        </Animated.View>
      </Animated.View>

      {/* Версия */}
      <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
        v2.0 Premium
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  content: {
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#ffffff',
    opacity: 0.3,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 10,
    opacity: 0.9,
    letterSpacing: 1,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
});
