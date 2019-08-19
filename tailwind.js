module.exports = {
  theme: {
    colors: {
      blue: {
        default: '#1976d2',
        accent: '#1E88E5',
        light: '#BBDEFB',
        lightest: '#E3F2FD',
        point2: '#1976d26633',
        point4: '#1976d266',
        point6: '#1976d299',
        point8: '#1976d2CC',
      },
      white: '#fff',
      red: '#D32F2F',
      orange: '#FFA500',
    },
    fontFamily: {
      'heading': 'Montserrat-Bold',
      'body': 'Montserrat-Light',
    },
    minWidth: {
      '1/4': '25%',
    },
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'first', 'last', 'even', 'odd', 'hover', 'focus'],
  },
  plugins: [],
}
