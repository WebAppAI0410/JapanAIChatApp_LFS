export const theme = {
  colors: {
    primary: '#06C755', // LINE's signature green
    secondary: '#00B900', // Darker green for buttons
    premium: '#9C27B0', // Purple for premium features
    background: '#FFFFFF',
    card: '#F8F8F8',
    text: '#333333',
    border: '#E0E0E0',
    notification: '#FF3B30',
    placeholder: '#8E8E93',
    bubble: {
      user: '#06C755', // User message bubbles (green)
      bot: '#F0F0F0',  // Bot message bubbles (light gray)
      userText: '#FFFFFF',
      botText: '#333333',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 20,
  },
  fontSizes: {
    tiny: 10,
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 22,
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};
