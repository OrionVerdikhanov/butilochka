import { TextStyle, ViewStyle } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    transparent: string;
  };
  gradients: {
    spinner: [string, string];
    target: [string, string];
    male: [string, string];
    female: [string, string];
    button: [string, string];
    background: [string, string];
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    light: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    heavy: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: string;
  };
}

export const defaultTheme: Theme = {
  colors: {
    primary: '#4a90e2',
    secondary: '#e65a9f',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#ffffff',
    textSecondary: '#b4b4b4',
    border: '#3a3a5c',
    shadow: '#000000',
    transparent: 'transparent',
  },
  gradients: {
    spinner: ['#ffd43b', '#fab005'],
    target: ['#51cf66', '#37b24d'],
    male: ['#4a90e2', '#357abd'],
    female: ['#ff69b4', '#e65a9f'],
    button: ['#667eea', '#764ba2'],
    background: ['#1a1a2e', '#16213e'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffffff',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: '#ffffff',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      color: '#ffffff',
      lineHeight: 24,
    },
    caption: {
      fontSize: 12,
      color: '#b4b4b4',
      lineHeight: 16,
    },
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: 'ease-in-out',
  },
};

export const PLAYER_STYLES = {
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 4,
    ...defaultTheme.shadows.medium,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: defaultTheme.colors.text,
    textAlign: 'center' as const,
  },
  likes: {
    fontSize: 10,
    color: defaultTheme.colors.textSecondary,
    marginTop: 2,
  },
};

export const BOTTLE_STYLES = {
  container: {
    width: 200,
    height: 200,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  bottle: {
    width: 200,
    height: 200,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...defaultTheme.shadows.heavy,
  },
};