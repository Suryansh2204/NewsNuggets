export const colors = {
  primary: '#2c3e50',
  secondary: '#3498db',
  accent: '#e74c3c',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  border: '#ecf0f1',
  notification: '#e74c3c',
  success: '#2ecc71',
  error: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  disabled: '#bdc3c7',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const fontSize = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
};

export const borderRadius = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  round: 9999,
};

export const shadow = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
};
