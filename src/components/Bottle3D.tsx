import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
  Rect,
  G,
  Circle,
  Line,
  Text,
} from 'react-native-svg';

interface Props {
  rotation: Animated.Value;
  isSpinning: boolean;
  size?: number;
  color?: 'red' | 'green' | 'blue' | 'purple' | 'gold';
}

const BOTTLE_COLORS = {
  red: {
    main: ['#ff6b6b', '#ee5a6f', '#d63447'],
    shadow: ['#d63447', '#c92a39'],
    highlight: ['#ff9999', '#ffaaaa'],
  },
  green: {
    main: ['#51cf66', '#40c057', '#37b24d'],
    shadow: ['#37b24d', '#2f9e44'],
    highlight: ['#8ce99a', '#b2f2bb'],
  },
  blue: {
    main: ['#4a90e2', '#357abd', '#2c5f99'],
    shadow: ['#2c5f99', '#1e4d7a'],
    highlight: ['#74b9ff', '#a8daff'],
  },
  purple: {
    main: ['#cc5de8', '#be4bdb', '#ae3ec9'],
    shadow: ['#ae3ec9', '#9c36b5'],
    highlight: ['#e599f7', '#f3d9fa'],
  },
  gold: {
    main: ['#ffd43b', '#fcc419', '#fab005'],
    shadow: ['#fab005', '#f59f00'],
    highlight: ['#ffe066', '#ffec99'],
  },
};

export default function Bottle3D({ rotation, isSpinning, size = 200, color = 'red' }: Props) {
  const colors = BOTTLE_COLORS[color];

  // Используем динамическую интерполяцию с экстраполяцией для корректного отображения любых значений
  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend', // Позволяет корректно обрабатывать значения за пределами диапазона
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.bottle,
          {
            transform: [{ rotate: rotateInterpolation }],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {/* Основной градиент стекла */}
            <SvgLinearGradient id="glassMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.main[0]} stopOpacity="0.95" />
              <Stop offset="50%" stopColor={colors.main[1]} stopOpacity="0.98" />
              <Stop offset="100%" stopColor={colors.main[2]} stopOpacity="1" />
            </SvgLinearGradient>

            {/* Градиент для бликов */}
            <RadialGradient id="glassReflection" cx="35%" cy="25%" r="30%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <Stop offset="40%" stopColor="#ffffff" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </RadialGradient>

            {/* Градиент для теней */}
            <SvgLinearGradient id="glassShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.shadow[0]} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={colors.shadow[1]} stopOpacity="0.95" />
            </SvgLinearGradient>

            {/* Градиент для горлышка */}
            <SvgLinearGradient id="neckGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.main[2]} stopOpacity="1" />
              <Stop offset="50%" stopColor={colors.main[1]} stopOpacity="0.95" />
              <Stop offset="100%" stopColor={colors.main[0]} stopOpacity="0.9" />
            </SvgLinearGradient>

            {/* Градиент свечения при вращении */}
            <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.highlight[0]} stopOpacity={isSpinning ? "0.8" : "0"} />
              <Stop offset="50%" stopColor={colors.highlight[1]} stopOpacity={isSpinning ? "0.4" : "0"} />
              <Stop offset="100%" stopColor={colors.main[0]} stopOpacity="0" />
            </RadialGradient>

            {/* Градиент для донышка */}
            <RadialGradient id="bottomGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.main[1]} stopOpacity="0.9" />
              <Stop offset="70%" stopColor={colors.shadow[0]} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.shadow[1]} stopOpacity="1" />
            </RadialGradient>

            {/* Градиент для стрелки - неоновый */}
            <SvgLinearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#00ff00" stopOpacity="1" />
              <Stop offset="100%" stopColor="#ff00ff" stopOpacity="1" />
            </SvgLinearGradient>

            {/* Градиент для свечения стрелки */}
            <RadialGradient id="arrowGlow" cx="50%" cy="20%" r="50%">
              <Stop offset="0%" stopColor="#00ff00" stopOpacity="0.8" />
              <Stop offset="50%" stopColor="#ff00ff" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Свечение при вращении */}
          <Circle cx="100" cy="100" r="90" fill="url(#glowGradient)" />

          {/* ОГРОМНОЕ яркое свечение вокруг стрелки */}
          <Circle cx="100" cy="30" r="55" fill="url(#arrowGlow)" />

          {/* МАКСИМАЛЬНО заметная стрелка указателя направления */}
          <Path
            d="M 100 -10 L 60 60 L 85 60 L 85 75 L 115 75 L 115 60 L 140 60 Z"
            fill="#ff0000"
            stroke="#000000"
            strokeWidth="4"
          />
          {/* Второй слой для контраста */}
          <Path
            d="M 100 -5 L 65 55 L 87 55 L 87 70 L 113 70 L 113 55 L 135 55 Z"
            fill="#ffff00"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* ЯРКАЯ неоновая заливка для стрелки */}
          <Path
            d="M 100 0 L 70 50 L 89 50 L 89 65 L 111 65 L 111 50 L 130 50 Z"
            fill="url(#arrowGradient)"
          />
          {/* СВЕРХЯРКАЯ белая обводка */}
          <Path
            d="M 100 0 L 70 50 L 89 50 L 89 65 L 111 65 L 111 50 L 130 50 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
          />
          {/* ЦЕНТРАЛЬНАЯ линия - ОЧЕНЬ ТОЛСТАЯ */}
          <Line
            x1="100"
            y1="65"
            x2="100"
            y2="160"
            stroke="#ff0000"
            strokeWidth="12"
            opacity="1"
          />
          <Line
            x1="100"
            y1="65"
            x2="100"
            y2="160"
            stroke="#ffff00"
            strokeWidth="8"
            opacity="0.9"
          />
          <Line
            x1="100"
            y1="65"
            x2="100"
            y2="160"
            stroke="#ffffff"
            strokeWidth="4"
            opacity="1"
          />

          {/* Основное тело бутылки */}
          <Path
            d="M 85 60 L 85 140 Q 85 155 100 155 Q 115 155 115 140 L 115 60 Q 115 50 100 50 Q 85 50 85 60 Z"
            fill="url(#glassMain)"
          />

          {/* Левая тень на теле */}
          <Path
            d="M 85 60 L 85 140 Q 85 155 100 155 L 100 50 Q 85 50 85 60 Z"
            fill="url(#glassShadow)"
            opacity="0.3"
          />

          {/* Горлышко */}
          <Rect
            x="92"
            y="30"
            width="16"
            height="25"
            rx="2"
            fill="url(#neckGradient)"
          />

          {/* Тень на горлышке */}
          <Rect
            x="92"
            y="30"
            width="8"
            height="25"
            rx="2"
            fill={colors.shadow[0]}
            opacity="0.4"
          />

          {/* Крышка */}
          <Ellipse
            cx="100"
            cy="30"
            rx="10"
            ry="4"
            fill={colors.shadow[1]}
          />

          <Ellipse
            cx="100"
            cy="28"
            rx="10"
            ry="4"
            fill={colors.main[2]}
          />

          {/* Блик на крышке */}
          <Ellipse
            cx="97"
            cy="27"
            rx="4"
            ry="2"
            fill="#ffffff"
            opacity="0.6"
          />

          {/* Донышко */}
          <Ellipse
            cx="100"
            cy="155"
            rx="15"
            ry="5"
            fill="url(#bottomGradient)"
          />

          {/* Основной блик на теле */}
          <Ellipse
            cx="95"
            cy="80"
            rx="12"
            ry="35"
            fill="url(#glassReflection)"
          />

          {/* Дополнительный блик */}
          <Ellipse
            cx="98"
            cy="70"
            rx="6"
            ry="15"
            fill="#ffffff"
            opacity="0.5"
          />

          {/* Маленький блик сверху */}
          <Ellipse
            cx="96"
            cy="55"
            rx="3"
            ry="8"
            fill="#ffffff"
            opacity="0.7"
          />

          {/* Блик на правой стороне */}
          <Ellipse
            cx="110"
            cy="100"
            rx="4"
            ry="20"
            fill="#ffffff"
            opacity="0.2"
          />

          {/* Стрелка указателя (горлышко как стрелка) */}
          <G>
            <Path
              d="M 100 20 L 95 30 L 105 30 Z"
              fill={colors.shadow[1]}
              opacity="0.8"
            />
            <Path
              d="M 100 18 L 96 28 L 104 28 Z"
              fill={colors.highlight[0]}
            />
          </G>

          {/* Детали текстуры стекла */}
          <Path
            d="M 88 70 Q 90 75 88 80"
            stroke="#ffffff"
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
          <Path
            d="M 112 90 Q 110 95 112 100"
            stroke={colors.shadow[0]}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
          />
        </Svg>
      </Animated.View>

      {/* Тень под бутылкой */}
      <View style={styles.shadow}>
        <Svg width={size} height={size * 0.2} viewBox="0 0 200 40">
          <Defs>
            <RadialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
              <Stop offset="50%" stopColor="#000000" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx="100"
            cy="20"
            rx={isSpinning ? "35" : "30"}
            ry={isSpinning ? "10" : "8"}
            fill="url(#shadowGradient)"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
