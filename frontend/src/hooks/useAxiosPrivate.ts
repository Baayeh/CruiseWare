import axios, { InternalAxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import { confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../features/authentication';
import { useAppDispatch } from './useStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const useAxiosPrivate = () => {
  // get access and refresh tokens from local storage
  const accessToken = localStorage.getItem('accessToken') || '';
  const refreshToken = localStorage.getItem('refreshToken') || '';

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  // Open end session dialog
  const openEndSessionDialog = () => {
    confirmDialog({
      message: 'Your session has expired. Please login again.',
      header: 'Session expired',
      icon: 'pi pi-exclamation-triangle',
      position: 'top',
      blockScroll: true,
      closable: false,
      closeOnEscape: false,
      draggable: false,
      rejectClassName: 'hidden',
      acceptLabel: 'Login',
      acceptClassName:
        'bg-[#ff5722] border-none focus:shadow-none enabled:hover:bg-[#ff8000]',
      accept: () => {
        localStorage.clear();
        navigate('/login');
      },
    });
  };

  // create axios instance
  const privateInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // request interceptor
  privateInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const user: any = jwt_decode(accessToken);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      console.log('isExpired: ', isExpired);

      if (!isExpired) {
        return config;
      } else {
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        if (response.status === 200) {
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          dispatch(setAccessToken(access));
          config.headers.Authorization = `Bearer ${access}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // response interceptor
  privateInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response) {
        if (error.response.status === 404 && error.response.data) {
          if (error.config.url === `${baseURL}/auth/refresh`) {
            openEndSessionDialog();
            return Promise.reject(error.response.data);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return privateInstance;
};

export default useAxiosPrivate;
