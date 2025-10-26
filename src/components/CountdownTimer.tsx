import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface Props {
  duration: number; // seconds
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function CountdownTimer({ duration, onComplete, autoStart = true }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          ReactNativeHapticFeedback.trigger('notificationWarning');
          onComplete?.();
          return 0;
        }

        // Haptic feedback at 10, 5, 3, 2, 1 seconds
        if (prev <= 10 && prev > 0) {
          ReactNativeHapticFeedback.trigger('impactLight');
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: timeLeft / duration,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Pulse animation when time is running out
    if (timeLeft <= 10 && timeLeft > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [timeLeft, duration, progressAnim, pulseAnim]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = (): string[] => {
    if (timeLeft > 30) return ['#51cf66', '#37b24d'];
    if (timeLeft > 10) return ['#ffd43b', '#fab005'];
    return ['#ff6b6b', '#ee5a6f'];
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient colors={getColor()} style={styles.timerGradient}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>осталось</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
          <LinearGradient
            colors={getColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 16,
  },
  timerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timerLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
});
