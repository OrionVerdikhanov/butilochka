import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle, Defs, RadialGradient, Stop, Rect, Ellipse, Text, LinearGradient, Filter, FeGaussianBlur, FeMerge, FeMergeNode, Animate } from 'react-native-svg';
import { BOTTLE_STYLES, defaultTheme } from '../constants/theme';

export type BottleVariant = '2d' | '3d' | 'premium';

interface BottleProps {
  rotation: Animated.Value;
  isSpinning: boolean;
  variant?: BottleVariant;
  size?: number;
  style?: any;
  color?: string;
}

const Bottle: React.FC<BottleProps> = ({
  rotation,
  isSpinning,
  variant = '3d',
  size = 200,
  style,
  color,
}) => {
  const spin = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const render2DBottle = () => (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={[styles.bottle, { transform: [{ rotate: spin }] }]}>
        <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="bottleGradient" cx="50%" cy="30%">
              <Stop offset="0%" stopColor="#4a90e2" stopOpacity="1" />
              <Stop offset="100%" stopColor="#357abd" stopOpacity="1" />
            </RadialGradient>
            <RadialGradient id="capGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#666" stopOpacity="1" />
              <Stop offset="100%" stopColor="#333" stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Bottle body */}
          <Path
            d="M100 40 C120 40 130 50 130 70 L130 130 C130 150 120 160 100 160 C80 160 70 150 70 130 L70 70 C70 50 80 40 100 40 Z"
            fill="url(#bottleGradient)"
            stroke="#2a5f8f"
            strokeWidth="2"
          />

          {/* Bottle neck */}
          <Rect x="90" y="30" width="20" height="20" fill="url(#capGradient)" />

          {/* Bottle highlight */}
          <Ellipse cx="85" cy="80" rx="15" ry="30" fill="white" opacity="0.3" />
        </Svg>
      </Animated.View>
    </View>
  );

  const render3DBottle = () => (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={[styles.bottle3d, { transform: [{ rotate: spin }] }]}>
        <Svg width={size * 0.9} height={size * 0.9} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="bottleBody" cx="50%" cy="40%" rx="60%" ry="60%">
              <Stop offset="0%" stopColor="#5ba3f5" />
              <Stop offset="50%" stopColor="#4a90e2" />
              <Stop offset="100%" stopColor="#2a5f8f" />
            </RadialGradient>
            <RadialGradient id="bottleHighlight" cx="35%" cy="30%" rx="25%" ry="35%">
              <Stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="white" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bottleCap" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#888" />
              <Stop offset="100%" stopColor="#444" />
            </RadialGradient>
          </Defs>

          <G>
            {/* Bottle shadow */}
            <Ellipse
              cx="100"
              cy="185"
              rx="45"
              ry="8"
              fill="black"
              opacity={0.2}
            />

            {/* Bottle body */}
            <Path
              d="M100 35 C130 35 145 55 145 90 L145 150 C145 165 130 170 100 170 C70 170 55 165 55 150 L55 90 C55 55 70 35 100 35 Z"
              fill="url(#bottleBody)"
              stroke="#2a5f8f"
              strokeWidth="1"
            />

            {/* Bottle neck */}
            <Rect x="85" y="25" width="30" height="20" rx="3" fill="url(#bottleCap)" />
            <Rect x="90" y="20" width="20" height="10" rx="2" fill="#666" />

            {/* Label */}
            <Rect x="70" y="80" width="60" height="40" rx="5" fill="white" opacity="0.9" />
            <Text x="100" y="95" textAnchor="middle" fill="#2a5f8f" fontSize="12" fontWeight="bold">
              БУТИЛКА
            </Text>
            <Text x="100" y="110" textAnchor="middle" fill="#4a90e2" fontSize="8">
              2.0
            </Text>

            {/* Highlight effect */}
            <Path
              d="M75 50 Q85 45 90 50 L90 130 Q85 135 75 130 Z"
              fill="url(#bottleHighlight)"
              opacity="0.5"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );

  const renderPremiumBottle = () => (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.bottlePremium,
          {
            transform: [
              { rotate: spin },
              {
                scale: rotation.interpolate({
                  inputRange: [0, 180, 360],
                  outputRange: [1, 1.1, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {/* Golden gradient for premium bottle */}
            <RadialGradient id="goldGradient" cx="50%" cy="30%" rx="70%" ry="70%">
              <Stop offset="0%" stopColor="#ffd700" />
              <Stop offset="50%" stopColor="#ffed4e" />
              <Stop offset="100%" stopColor="#d4af37" />
            </RadialGradient>

            {/* Glow effect */}
            <RadialGradient id="glowEffect" cx="50%" cy="50%" rx="100%" ry="100%">
              <Stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
              <Stop offset="50%" stopColor="#ffed4e" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
            </RadialGradient>

            {/* Diamond gradient for cap */}
            <LinearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#e0e0e0" />
              <Stop offset="50%" stopColor="white" />
              <Stop offset="100%" stopColor="#c0c0c0" />
            </LinearGradient>

            {/* Sparkle filters */}
            <Filter id="sparkle">
              <FeGaussianBlur stdDeviation="1" result="coloredBlur" />
              <FeMerge>
                <FeMergeNode in="coloredBlur" />
                <FeMergeNode in="SourceGraphic" />
              </FeMerge>
            </Filter>
          </Defs>

          <G>
            {/* Glow effect when spinning */}
            {isSpinning && (
              <Circle cx="100" cy="100" r="80" fill="url(#glowEffect)" />
            )}

            {/* Bottle body with golden gradient */}
            <Path
              d="M100 30 C135 30 150 45 150 75 L150 145 C150 165 135 175 100 175 C65 175 50 165 50 145 L50 75 C50 45 65 30 100 30 Z"
              fill="url(#goldGradient)"
              stroke="#d4af37"
              strokeWidth="2"
            />

            {/* Premium neck with diamond look */}
            <Rect x="80" y="20" width="40" height="20" rx="5" fill="url(#diamondGradient)" />
            <Rect x="85" y="15" width="30" height="8" rx="2" fill="#f0f0f0" />

            {/* Crystal details */}
            <Circle cx="70" cy="60" r="3" fill="white" opacity="0.8" filter="url(#sparkle)" />
            <Circle cx="130" cy="80" r="2" fill="white" opacity="0.6" filter="url(#sparkle)" />
            <Circle cx="75" cy="120" r="2.5" fill="white" opacity="0.7" filter="url(#sparkle)" />
            <Circle cx="125" cy="140" r="2" fill="white" opacity="0.5" filter="url(#sparkle)" />

            {/* Premium label */}
            <Rect x="65" y="75" width="70" height="50" rx="8" fill="white" opacity="0.95" />
            <Rect x="70" y="80" width="60" height="40" rx="5" fill="none" stroke="#d4af37" strokeWidth="2" />

            {/* Premium text */}
            <Text x="100" y="95" textAnchor="middle" fill="#d4af37" fontSize="14" fontWeight="bold">
              PREMIUM
            </Text>
            <Text x="100" y="110" textAnchor="middle" fill="#b8860b" fontSize="10">
              ✓ Gold Edition
            </Text>

            {/* Reflection effects */}
            <Path
              d="M70 45 Q85 35 95 45 L95 125 Q85 135 70 125 Z"
              fill="white"
              opacity="0.4"
            />

            {/* Animated sparkles around bottle */}
            {isSpinning && (
              <>
                <Circle cx="40" cy="50" r="1.5" fill="white" opacity="0.8">
                  <Animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </Circle>
                <Circle cx="160" cy="70" r="1.5" fill="white" opacity="0.8">
                  <Animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </Circle>
                <Circle cx="45" cy="130" r="1.5" fill="white" opacity="0.8">
                  <Animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </Circle>
                <Circle cx="155" cy="150" r="1.5" fill="white" opacity="0.8">
                  <Animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </Circle>
              </>
            )}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );

  switch (variant) {
    case '2d':
      return render2DBottle();
    case 'premium':
      return renderPremiumBottle();
    case '3d':
    default:
      return render3DBottle();
  }
};

const styles = StyleSheet.create({
  container: BOTTLE_STYLES.container,
  bottle: BOTTLE_STYLES.bottle,
  bottle3d: {
    ...BOTTLE_STYLES.bottle,
    transform: [{ perspective: 1000 }],
  },
  bottlePremium: {
    ...BOTTLE_STYLES.bottle,
  },
});

export default React.memo(Bottle);