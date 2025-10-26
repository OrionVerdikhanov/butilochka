import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultTheme } from '../constants/theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(
  ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
  }) => {
    const getGradientColors = (): [string, string] => {
      switch (variant) {
        case 'secondary':
          return defaultTheme.gradients.male;
        case 'danger':
          return ['#ff6b6b', '#ee5a52'];
        default:
          return defaultTheme.gradients.button;
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'small':
          return {
            button: {
              paddingHorizontal: defaultTheme.spacing.md,
              paddingVertical: defaultTheme.spacing.sm,
              borderRadius: defaultTheme.borderRadius.md,
            },
            text: {
              fontSize: 14,
            },
          };
        case 'large':
          return {
            button: {
              paddingHorizontal: defaultTheme.spacing.xl,
              paddingVertical: defaultTheme.spacing.lg,
              borderRadius: defaultTheme.borderRadius.xl,
            },
            text: {
              fontSize: 18,
            },
          };
        default:
          return {
            button: {
              paddingHorizontal: defaultTheme.spacing.lg,
              paddingVertical: defaultTheme.spacing.md,
              borderRadius: defaultTheme.borderRadius.lg,
            },
            text: {
              fontSize: 16,
            },
          };
      }
    };

    const sizeStyles = getSizeStyles();

    const buttonContent = (
      <>
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text
              style={[
                styles.text,
                sizeStyles.text,
                {
                  marginLeft: icon ? defaultTheme.spacing.sm : 0,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </>
    );

    const buttonStyle = [
      styles.button,
      sizeStyles.button,
      { opacity: disabled || loading ? 0.6 : 1 },
      style,
    ];

    if (disabled) {
      return (
        <View style={[buttonStyle, styles.disabled]}>
          {buttonContent}
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient
          colors={getGradientColors()}
          style={buttonStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
);

ActionButton.displayName = 'ActionButton';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...defaultTheme.shadows.medium,
  },
  disabled: {
    backgroundColor: '#555',
  },
  text: {
    color: defaultTheme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ActionButton;