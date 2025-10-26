import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PropsWithChildren } from 'react';
import { defaultTheme } from '@constants/theme';
import AnimatedBackground from './AnimatedBackground';

interface GameLayoutProps {
  backgroundImage?: boolean;
  withSafeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content';
  containerStyle?: any;
}

const GameLayout: React.FC<PropsWithChildren<GameLayoutProps>> = ({
  children,
  backgroundImage = true,
  withSafeArea = true,
  statusBarStyle = 'light-content',
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();

  const Container = withSafeArea ? SafeAreaView : View;
  const containerDynamicStyle = withSafeArea
    ? {
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }
    : {
        flex: 1,
      };

  return (
    <Container style={[styles.container, containerDynamicStyle, containerStyle]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={defaultTheme.colors.background} />
      {backgroundImage && <AnimatedBackground />}
      <View style={styles.content}>{children}</View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTheme.colors.background,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});

export default React.memo(GameLayout);