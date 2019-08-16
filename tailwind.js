module.exports = {
  theme: {
    colors: {
      blue: {
        default: '#1976d2',
        accent: '#1E88E5',
        light: '#BBDEFB',
        lightest: '#E3F2FD',
        point4: '#1976d266',
      },
      white: '#fff',
      red: '#D32F2F',
      orange: '#FFA500',
    },
    fontFamily: {
      'heading': 'Montserrat-Bold',
      'body': 'Montserrat-Light',
    },
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'first', 'last', 'even', 'odd', 'hover', 'focus'],
  },
  plugins: [],
}
