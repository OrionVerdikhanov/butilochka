import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '@types/index';
import { PLAYER_STYLES, defaultTheme } from '@constants/theme';

interface PlayerCircleProps {
  player: Player;
  isSpinner?: boolean;
  isTarget?: boolean;
  size?: number;
  style?: any;
  showLikes?: boolean;
  animated?: boolean;
  scaleValue?: Animated.Value;
}

const PlayerCircle: React.FC<PlayerCircleProps> = React.memo(
  ({
    player,
    isSpinner = false,
    isTarget = false,
    size = 80,
    style,
    showLikes = false,
    animated = false,
    scaleValue,
  }) => {
    const getGradientColors = (): [string, string] => {
      if (isSpinner) return defaultTheme.gradients.spinner;
      if (isTarget) return defaultTheme.gradients.target;
      return player.gender === 'M' ? defaultTheme.gradients.male : defaultTheme.gradients.female;
    };

    const containerStyle = [
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        transform: [
          { translateX: -size / 2 },
          { translateY: -size / 2 },
          ...(animated && scaleValue ? [{ scale: scaleValue }] : []),
        ],
      },
      style,
    ];

    const textStyle = [
      styles.text,
      {
        fontSize: Math.max(10, size / 6),
      },
    ];

    const likesStyle = [
      styles.likes,
      {
        fontSize: Math.max(8, size / 10),
      },
    ];

    return (
      <Animated.View style={containerStyle}>
        <LinearGradient
          colors={getGradientColors()}
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <Text style={textStyle} numberOfLines={1}>
              {player.name}
            </Text>
            {showLikes && player.likes !== undefined && player.likes > 0 && (
              <Text style={likesStyle}>❤️ {player.likes}</Text>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }
);

PlayerCircle.displayName = 'PlayerCircle';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    ...PLAYER_STYLES.circle,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: defaultTheme.colors.surface,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    ...PLAYER_STYLES.text,
    fontWeight: '600',
  },
  likes: {
    ...PLAYER_STYLES.likes,
    fontWeight: '500',
  },
});

export default PlayerCircle;