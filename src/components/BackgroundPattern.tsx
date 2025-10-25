import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Defs,
  Pattern,
  Rect,
  Circle,
  Path,
  Polygon,
  G,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface Props {
  pattern: 'hearts' | 'circles' | 'stars' | 'waves' | 'geometric' | 'confetti';
  opacity?: number;
}

export default function BackgroundPattern({ pattern, opacity = 0.1 }: Props) {
  const renderPattern = () => {
    switch (pattern) {
      case 'hearts':
        return (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern
                id="heartPattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                {/* Сердечко 1 */}
                <Path
                  d="M 20,25 C 20,20 15,15 10,15 C 5,15 0,20 0,25 C 0,35 10,40 10,40 C 10,40 20,35 20,25 Z"
                  fill="#ff6b9d"
                  opacity={opacity}
                />
                {/* Сердечко 2 (смещенное) */}
                <Path
                  d="M 70,65 C 70,62 68,59 65,59 C 62,59 60,62 60,65 C 60,71 65,74 65,74 C 65,74 70,71 70,65 Z"
                  fill="#ff85a8"
                  opacity={opacity * 0.7}
                />
              </Pattern>
            </Defs>
            <Rect width={width} height={height} fill="url(#heartPattern)" />
          </Svg>
        );

      case 'circles':
        return (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern
                id="circlePattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <Circle cx="50" cy="50" r="20" fill="#667eea" opacity={opacity} />
                <Circle cx="50" cy="50" r="15" fill="#764ba2" opacity={opacity * 0.5} />
                <Circle cx="10" cy="10" r="8" fill="#f093fb" opacity={opacity * 0.7} />
                <Circle cx="90" cy="90" r="6" fill="#4facfe" opacity={opacity * 0.6} />
              </Pattern>
            </Defs>
            <Rect width={width} height={height} fill="url(#circlePattern)" />
          </Svg>
        );

      case 'stars':
        return (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern
                id="starPattern"
                x="0"
                y="0"
                width="120"
                height="120"
                patternUnits="userSpaceOnUse"
              >
                {/* Большая звезда */}
                <Polygon
                  points="30,10 35,25 50,25 38,35 42,50 30,40 18,50 22,35 10,25 25,25"
                  fill="#ffd43b"
                  opacity={opacity}
                />
                {/* Маленькая звезда 1 */}
                <Polygon
                  points="80,70 83,78 91,78 85,83 87,91 80,86 73,91 75,83 69,78 77,78"
                  fill="#ffe066"
                  opacity={opacity * 0.8}
                />
                {/* Маленькая звезда 2 */}
                <Polygon
                  points="100,20 102,26 108,26 103,30 105,36 100,32 95,36 97,30 92,26 98,26"
                  fill="#fab005"
                  opacity={opacity * 0.6}
                />
              </Pattern>
            </Defs>
            <Rect width={width} height={height} fill="url(#starPattern)" />
          </Svg>
        );

      case 'waves':
        return (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern
                id="wavePattern"
                x="0"
                y="0"
                width="200"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <Path
                  d="M 0,50 Q 50,30 100,50 T 200,50"
                  stroke="#4ecdc4"
                  strokeWidth="3"
                  fill="none"
                  opacity={opacity}
                />
                <Path
                  d="M 0,60 Q 50,40 100,60 T 200,60"
                  stroke="#44a3d9"
                  strokeWidth="2"
                  fill="none"
                  opacity={opacity * 0.7}
                />
                <Path
                  d="M 0,70 Q 50,50 100,70 T 200,70"
                  stroke="#6bcfeb"
                  strokeWidth="1.5"
                  fill="none"
                  opacity={opacity * 0.5}
                />
              </Pattern>
            </Defs>
            <Rect width={width} height={height} fill="url(#wavePattern)" />
          </Svg>
        );

      case 'geometric':
        return (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern
                id="geoPattern"
                x="0"
                y="0"
                width="120"
                height="120"
                patternUnits="userSpaceOnUse"
              >
                {/* Треугольник */}
                <Polygon
                  points="20,10 35,35 5,35"
                  fill="#ff6b6b"
                  opacity={opacity}
                />
                {/* Квадрат */}
                <Rect
                  x="50"
                  y="50"
                  width="30"
                  height="30"
                  fill="#51cf66"
                  opacity={opacity * 0.8}
                  transform="rotate(45 65 65)"
                />
                {/* Шестиугольник */}
                <Polygon
                  points="100,20 110,30 110,50 100,60 90,50 90,30"
                  fill="#4a90e2"
                  opacity={opacity * 0.7}
                />
                {/* Круг */}
                <Circle
                  cx="25"
                  cy="85"
                  r="12"
                  fill="#cc5de8"
                  opacity={opacity * 0.6}
                />
              </Pattern>
            </Defs>
            <Rect width={width} height={height} fill="url(#geoPattern)" />
          </Svg>
        );

      case 'confetti':
        return (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Pattern
                id="confettiPattern"
                x="0"
                y="0"
                width="150"
                height="150"
                patternUnits="userSpaceOnUse"
              >
                {/* Конфетти - разноцветные кружочки и палочки */}
                <Circle cx="20" cy="30" r="4" fill="#ff6b6b" opacity={opacity} />
                <Circle cx="80" cy="50" r="3" fill="#51cf66" opacity={opacity} />
                <Circle cx="120" cy="20" r="5" fill="#4a90e2" opacity={opacity} />
                <Circle cx="40" cy="90" r="3" fill="#ffd43b" opacity={opacity} />
                <Circle cx="100" cy="110" r="4" fill="#cc5de8" opacity={opacity} />

                <Rect x="60" y="70" width="8" height="3" fill="#ff9999" opacity={opacity} transform="rotate(30 64 71)" />
                <Rect x="30" y="120" width="6" height="2" fill="#a8daff" opacity={opacity} transform="rotate(-45 33 121)" />
                <Rect x="110" cy="80" width="7" height="3" fill="#8ce99a" opacity={opacity} transform="rotate(60 113 81)" />
                <Rect x="70" y="25" width="5" height="2" fill="#ffe066" opacity={opacity} transform="rotate(-20 72 26)" />

                {/* Маленькие звездочки */}
                <Path d="M 50,60 L 52,64 L 56,64 L 53,67 L 54,71 L 50,68 L 46,71 L 47,67 L 44,64 L 48,64 Z" fill="#f5576c" opacity={opacity * 0.8} />
                <Path d="M 130,100 L 131,102 L 133,102 L 131,104 L 132,106 L 130,104 L 128,106 L 129,104 L 127,102 L 129,102 Z" fill="#00f2fe" opacity={opacity * 0.8} />
              </Pattern>
            </Defs>
            <Rect width={width} height={height} fill="url(#confettiPattern)" />
          </Svg>
        );

      default:
        return null;
    }
  };

  return <View style={StyleSheet.absoluteFill}>{renderPattern()}</View>;
}
