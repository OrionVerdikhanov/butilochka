import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Line } from 'react-native-svg';
import { Player } from '../../types';
import PlayerAvatar from './PlayerAvatar';

interface GameCircleProps {
  players: Player[];
  currentSpinner?: Player | null;
  targetPlayer?: Player | null;
  pulseAnim?: any;
}

const GameCircle = React.memo(({
  players,
  currentSpinner,
  targetPlayer,
  pulseAnim
}: GameCircleProps) => {
  const renderSectorBoundaries = () => {
    const radius = 160;
    const centerX = 160;
    const centerY = 160;

    return players.map((player, index) => {
      const angle = (index * 360) / players.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      const strokeColor = player.gender === 'M' ? '#4a90e2' : '#ff69b4';

      return (
        <Line
          key={`boundary-${player.id}`}
          x1={centerX}
          y1={centerY}
          x2={x}
          y2={y}
          stroke={strokeColor}
          strokeWidth="2"
          opacity="0.3"
        />
      );
    });
  };

  const renderPlayers = () => {
    const radius = 140;
    const centerX = 0;
    const centerY = 0;

    return players.map((player, index) => {
      const angle = (index * 360) / players.length - 90;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      const isSpinner = !!currentSpinner && index === players.indexOf(currentSpinner);
      const isTarget = !!targetPlayer && index === players.indexOf(targetPlayer);

      return (
        <PlayerAvatar
          key={player.id}
          player={player}
          x={x}
          y={y}
          isSpinner={isSpinner}
          isTarget={isTarget}
          pulseAnim={pulseAnim}
        />
      );
    });
  };

  return (
    <>
      <Svg style={StyleSheet.absoluteFill} width={320} height={320}>
        {renderSectorBoundaries()}
      </Svg>

      <View style={styles.playersCircle}>{renderPlayers()}</View>
    </>
  );
});

const styles = StyleSheet.create({
  playersCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
  },
});

GameCircle.displayName = 'GameCircle';

export default GameCircle;