// layouts
export { default as AuthLayout } from './layouts/AuthLayout';

// registration page
export { default as StepButtons } from './components/StepButtons';
export { default as AccountInfo } from './components/register-forms/AccountInfo';
export { default as CompanyContact } from './components/register-forms/CompanyContact';
export { default as CompanyInfo } from './components/register-forms/CompanyInfo';
export { default as Welcome } from './components/register-forms/Welcome';

export {
  default as authSlice,
  logOut,
  selectAuth,
  setAccessToken,
  setCredentials,
  setIsLocked,
  updateCompanyInfo,
  updateUserInfo,
} from './app/authSlice';
