export const COLORS = {
  primary: '#5B37B7',
  secondary: '#4CAF50',
  tertiary: '#FF6B6B',
  
  white: '#FFFFFF',
  black: '#000000',
  
  gray100: '#F7F7F7',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#FF5252',
  info: '#2196F3',
  
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',

  // New colors for chat
  chatUserBubble: "#5B37B7",
  chatBotBubble: "#F0EBFA",
  chatUserText: "#FFFFFF",
  chatBotText: "#333333",
  chatInputBackground: "#F5F5F5",
};

export const FONT = {
  regular: 'DMRegular',
  medium: 'DMMedium',
  bold: 'DMBold',
};

export const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
};

export default { COLORS, FONT, SIZES, SHADOWS }; 