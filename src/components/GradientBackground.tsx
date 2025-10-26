import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  children: React.ReactNode;
  colors?: string[];
  style?: any;
}

export default function GradientBackground({
  children,
  colors = ['#f7f7f7', '#e8e8e8'],
  style
}: Props) {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
