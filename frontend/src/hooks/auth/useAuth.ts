/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import instance from '../axios';

const useAuth = () => {
  const [data, setData] = useState<AuthResponseData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState(null);

  const loginUser = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const response = await instance.post('/auth/login', values);
      setData(response.data.data);
      setAccess(response.data.access);
      setRefresh(response.data.refresh);
      setAuth(response.data.auth);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false);
      setAuth(error.response.data.auth);
      setAccess(null);
      setRefresh(null);
      setData(null);
    }
  };

  const createUser = async (values: AccountCreationData) => {
    try {
      setLoading(true);
      const response = await instance.post('/register', values);
      setData(response.data.data.data);
      setAccess(response.data.data.access);
      setRefresh(response.data.data.refresh);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setError(error.response.data.error);
      setLoading(false);
      setAccess(null);
      setRefresh(null);
      setData(null);
    }
  };

  const logoutUser = async (refreshToken: string) => {
    try {
      setLoading(true);
      const response = await instance.post('/auth/logout', {
        refreshToken,
      });
      setMessage(response.data.message);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setError(error.response.data.message);
      setAuth(error.response.data.auth);
      setLoading(false);
      setData(null);
    }
  };

  const resetState = () => {
    setData(null);
    setAccess(null);
    setRefresh(null);
    setLoading(false);
    setError(null);
    setAuth(null);
  };

  return {
    data,
    access,
    refresh,
    loading,
    error,
    auth,
    loginUser,
    createUser,
    resetState,
    logoutUser,
    message,
  };
};

export default useAuth;
