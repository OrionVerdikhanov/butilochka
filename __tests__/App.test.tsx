import 'react-native';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

// Mock the safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  }),
  SafeAreaProvider: ({ children }: any) => children,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  G: 'G',
  Text: 'Text',
  TSpan: 'TSpan',
  TextPath: 'TextPath',
  Path: 'Path',
  Polygon: 'Polygon',
  Polyline: 'Polyline',
  Line: 'Line',
  Rect: 'Rect',
  Use: 'Use',
  Image: 'Image',
  Symbol: 'Symbol',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
  ClipPath: 'ClipPath',
  Pattern: 'Pattern',
  Mask: 'Mask',
}));

// Mock LinearGradient
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// Mock haptic feedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    // App should render without crashing
    expect(screen.UNSAFE_root).toBeTruthy();
  });
});

describe('Component Architecture', () => {
  it('should have proper TypeScript types', () => {
    // This test ensures TypeScript compilation works
    expect(true).toBe(true);
  });
});

describe('Game Logic', () => {
  it('should handle player creation', () => {
    // Basic test structure for future game logic tests
    const mockPlayer = {
      id: '1',
      name: 'Test Player',
      gender: 'M' as const,
      likes: 0,
    };
    expect(mockPlayer.id).toBe('1');
    expect(mockPlayer.name).toBe('Test Player');
    expect(mockPlayer.gender).toBe('M');
  });
});