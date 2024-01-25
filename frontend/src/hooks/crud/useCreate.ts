/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import useAxiosPrivate from '../useAxiosPrivate';

const useCreate = (url: string) => {
  const privateInstance = useAxiosPrivate();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createData = async (body: object = {}) => {
    try {
      setLoading(true);
      const response = await privateInstance.post(url, body);
      setData(response.data.message);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.error);
      setData(null);
    }
  };

  const resetState = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    createData,
    resetState,
  };
};

export default useCreate;
