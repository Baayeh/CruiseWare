/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useState } from 'react';
import useAxiosPrivate from '../useAxiosPrivate';
import { useAppDispatch } from '../useStore';

const useFetch = (
  url: string,
  setAction: ActionCreatorWithPayload<any, string>
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const privateInstance = useAxiosPrivate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await privateInstance.get(url);
      if (response.data.data) {
        setData(response.data.data);
        dispatch(setAction(response.data.data));
      }

      if (response.data.businessData) {
        setData(response.data.businessData);
        dispatch(setAction(response.data.businessData));
      }

      setLoading(false);
      setError(null);
    } catch (error: any) {
      console.log('Error fetching data: ', error);
      setError(error.response.data.error);
      setLoading(false);
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
    fetchData,
    resetState,
  };
};

export default useFetch;
