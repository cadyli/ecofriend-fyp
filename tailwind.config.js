// tailwind.config.js
const {plugin} = require('twrnc');

module.exports = {
  content: ['./app/screens/HomeScreen.tsx}'],
  plugins: [
    plugin(({addUtilities}) => {
      addUtilities({
        'center-all': 'flex items-center justify-center flex-1',
      });
    }),
  ],
  theme: {
    extend: {
      colors: ({colors}) => ({
        'primary-blue': '#327D90',
        'primary-orange': '#E7943F',
        'primary-grey': '0C0101',
        'light-blue': '#6BB2C6',
        'light-grey': '#C1C1C1',
        current: colors.current,
        transparent: colors.transparent,
        black: colors.black,
        white: colors.white,
        slate: colors.slate,
        gray: colors.gray,
        zinc: colors.zinc,
        neutral: colors.neutral,
        stone: colors.stone,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.yellow,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
      }),
      fontFamily: {
        primary: ['OpenSans-VariableFont_wdth,wght'],
        'primary-alt': ['OpenSans-Italic-VariableFont_wdth,wght'],
      },
      screens: {
        main: {
          backgroundColor: '#327D90',
        },
      },
      fontSize: {
        xxs: '7px',
        xs: '11px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
      },
    },
  },
};
