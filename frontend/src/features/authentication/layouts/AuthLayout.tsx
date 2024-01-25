import outlinedInputClasses from '@mui/material/OutlinedInput/outlinedInputClasses';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import '../../../assets/css/Auth.scss';
import AuthNav from './AuthNav';

const customTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-brandBorderColor': '#E0E3E7',
          '--TextField-brandBorderHoverColor': '#B2BAC2',
          '--TextField-brandBorderFocusedColor': '#6F7E8C',
          '--TextField-brandErrorColor': '#fb3434',
          '& label.Mui-focused': {
            color: 'var(--TextField-brandBorderFocusedColor)',
          },
          '& label.Mui-error': {
            color: 'var(--TextField-brandErrorColor) !important',
          },
          '& label.MuiInputLabel-outlined': {
            color: 'var(--TextField-brandBorderColor)',
          },
          '& .MuiOutlinedInput-root': {
            color: 'var(--TextField-brandBorderColor)',
          },
          '& .MuiOutlinedInput-root.Mui-error': {
            color: 'var(--TextField-brandErrorColor) !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'var(--TextField-brandBorderColor)',
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandBorderHoverColor)',
          },
          [`&.Mui-error:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandErrorColor) !important',
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandBorderFocusedColor)',
          },
        },
      },
    },
  },
});

/**
 * Renders the AuthLayout component.
 *
 * @return {ReactNode} The rendered AuthLayout component.
 */
const AuthLayout = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <section id="auth-layout">
        <AuthNav />
        <Suspense>
          <Outlet />
        </Suspense>
      </section>
    </ThemeProvider>
  );
};
export default AuthLayout;
