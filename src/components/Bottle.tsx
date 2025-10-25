import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  rotation: Animated.Value;
  isSpinning: boolean;
}

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
        {/* Горлышко бутылки (указатель) */}
        <View style={styles.neck} />
        {/* Тело бутылки */}
        <View style={styles.body} />
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
  },
  neck: {
    width: 20,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  body: {
    width: 60,
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
