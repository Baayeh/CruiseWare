/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import useAxiosPrivate from '../useAxiosPrivate';

const useUpdate = (url: string, method: 'PUT' | 'PATCH') => {
  const privateInstance = useAxiosPrivate();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = async (body: object) => {
    try {
      setLoading(true);
      const response =
        method === 'PUT'
          ? await privateInstance.put(url, body)
          : await privateInstance.patch(url, body);
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
    updateData,
    resetState,
  };
};

export default useUpdate;
