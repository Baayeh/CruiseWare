import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { BsCaretUpFill } from 'react-icons/bs';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/Dashboard.scss';
import {
  selectAuth,
  setCredentials,
  setIsLocked,
} from '../../features/authentication';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { LockScreen } from '..';
import { selectTheme } from '../../app/themeSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { themePalette } from '../../libs';
import DashboardLoader from '../dashboard/DashboardLoader';
import DashboardNav from '../dashboard/DashboardNav';
import MainDialog from '../dashboard/MainDialog';
import NotificationDialog from '../dashboard/notifications/NotificationDialog';
import TaskBar from '../dashboard/TaskBar';
import PrivateRoute from '../PrivateRoute';

/**
 * Renders the Dashboard component.
 *
 * @return {JSX.Element} The rendered Dashboard component.
 */
const Dashboard = () => {
  const [isMainDialogVisible, setIsMainDialogVisible] =
    useState<boolean>(false);
  const [isNotificationDialogVisible, setIsNotificationDialogVisible] =
    useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const { darkMode } = useAppSelector(selectTheme);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isLocked } = useAppSelector(selectAuth);

  // get data from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('accessToken') || '';
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const companyData: CompanyState = JSON.parse(
    localStorage.getItem('company') || '{}'
  );

  const dispatch = useAppDispatch();
  const { company } = useAppSelector(selectAuth);

  // set current data from local storage
  useEffect(() => {
    dispatch(
      setCredentials({
        user,
        company: companyData,
        access: accessToken,
        refresh: refreshToken,
      })
    );
  }, []);

  useMemo(() => {
    if (darkMode) {
      setMode('dark');
    } else {
      setMode('light');
    }
  }, [darkMode]);

  const theme = useMemo(() => createTheme(themePalette(mode)), [mode]);

  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisibility);

  const toggleMainDialog = () => {
    setIsMainDialogVisible(!isMainDialogVisible);
  };

  const toggleNotificationDialog = () => {
    setIsNotificationDialogVisible(!isNotificationDialogVisible);
  };

  const getCurrentTheme = () => {
    if (darkMode) {
      return 'dark';
    } else {
      return 'light';
    }
  };

  useEffect(() => {
    const element = document.documentElement;
    const root = document.querySelector(':root');
    const currentTheme = getCurrentTheme();
    element.classList.add(currentTheme);
    root?.setAttribute('color-scheme', currentTheme);
  }, []);

  useEffect(() => {
    if (isLocked) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isLocked]);

  // show lock screen if app is idle for 30 minutes
  useEffect(() => {
    let timeoutId: number | undefined;

    const resetTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        dispatch(setIsLocked(true));
      }, 1800000); // 30 minutes in milliseconds

      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keydown', resetTimer);
      document.addEventListener('mousedown', resetTimer);
    };

    resetTimer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
      document.removeEventListener('mousedown', resetTimer);
    };
  }, []);

  return (
    <PrivateRoute>
      <ThemeProvider theme={theme}>
        <section id="dashboard-layout" className="relative">
          <div className="flex justify-between items-center">
            <div className="nav-header w-full lg:w-auto">
              <div
                className={`${
                  pathname === '/profile' ? 'py-5' : ''
                } flex justify-between items-center`}
              >
                <div
                  className={
                    pathname === '/profile' ? 'flex items-center gap-x-6' : ''
                  }
                >
                  {pathname === '/profile' ? (
                    <div className="">
                      <button
                        type="button"
                        className="border border-[color:var(--accent-primary)] text-[color:var(--accent-primary)] rounded-md px-4 py-2 flex justify-between items-center gap-x-2 hover:border-[color:var(--text-secondary)] hover:text-[color:var(--text-secondary)] transition-colors duration-300 ease-in-out  text-sm"
                        onClick={() => navigate(-1)}
                      >
                        <span>
                          <BiLeftArrowAlt />
                        </span>
                        Back
                      </button>
                    </div>
                  ) : null}
                  {!pathname.includes('/profile') ? (
                    <h1 className="font-bold text-2xl sm:text-3xl">
                      Main Dashboard
                    </h1>
                  ) : (
                    <h1 className="font-bold text-2xl sm:text-3xl">
                      Account Settings
                    </h1>
                  )}
                </div>
                <div className="sm:hidden p-1 rounded-full border border-[color:var(--text-secondary)]">
                  <div className="company__logo p-3 rounded-full font-bold bg-[color:var(--text-secondary)] text-[#e8e8e8] dark:text-[color:var(--primary-bg)]">
                    CN
                  </div>
                </div>
              </div>

              {!pathname.includes('/profile') ? <DashboardNav /> : null}
            </div>

            <div className="sm:flex items-end gap-x-3 text-sm hidden pr-6">
              <div className="text-end sm:hidden lg:block">
                <h2 className="font-semibold">{company?.businessName}</h2>
                <div className="flex gap-x-2 text-xs justify-end">
                  <p>{company?.businessEmail}</p>
                  <span>|</span>
                  <p>{company?.businessPhone}</p>
                </div>
                <p className="text-xs flex items-center gap-x-2 justify-end">
                  <span>{`${company?.businessAddress?.street}, ${company?.businessAddress?.city} ${company?.businessAddress?.state}`}</span>

                  <span>|</span>
                  <span>{`${company?.businessAddress?.country}`}</span>
                </p>
                <p className="text-xs font-medium">
                  <span>Timezone: {company?.businessAddress?.timezone}</span>
                </p>
              </div>
              <div className="p-1 rounded-full border border-[color:var(--text-secondary)]">
                <div className="company__logo p-3 rounded-full font-bold bg-[color:var(--text-secondary)] text-[#e8e8e8] dark:text-[color:var(--primary-bg)]">
                  CN
                </div>
              </div>
            </div>
          </div>

          <main>
            <Suspense fallback={<DashboardLoader />}>
              <Outlet />
            </Suspense>
          </main>

          {isVisible && (
            <div className="scroll-top-btn">
              <button type="button" title="Scroll to top" onClick={scrollToTop}>
                <span>
                  <BsCaretUpFill />
                </span>
              </button>
            </div>
          )}

          <TaskBar
            toggleMainDialog={toggleMainDialog}
            toggleNotificationDialog={toggleNotificationDialog}
          />
          <MainDialog
            visible={isMainDialogVisible}
            setVisible={setIsMainDialogVisible}
          />
          <NotificationDialog
            visible={isNotificationDialogVisible}
            setVisible={setIsNotificationDialogVisible}
          />
          <ConfirmDialog />

          {isLocked && <LockScreen />}
        </section>
      </ThemeProvider>
    </PrivateRoute>
  );
};
export default Dashboard;
