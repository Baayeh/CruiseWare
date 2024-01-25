/**
 * Returns a theme palette object based on the selected mode.
 *
 * @param {string} mode - The mode of the theme palette. Either 'light' or 'dark'.
 * @return {object} The theme palette object with color values based on the selected mode.
 */
const themePalette = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          common: {
            black: '#0f172a',
            white: '#f4f4f4',
          },
          primary: {
            main: '#0f172a',
            light: '#0f172a',
            contrastText: '#64748b',
          },
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
          },
        }
      : {
          // palette values for dark mode
          common: {
            black: '#0f172a',
            white: '#f4f4f4',
          },
          primary: {
            main: '#f4f4f4',
            light: '#f4f4f4',
            contrastText: '#7f8ea3',
          },
          text: {
            primary: '#f4f4f4',
            secondary: '#7f8ea3',
          },
        }),
  },
});

export default themePalette;
