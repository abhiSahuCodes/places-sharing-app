import { useCallback, useState, useEffect, useRef } from "react";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request was aborted:', url);
        } else {
          setError(error.message || "Something went wrong!!");
        }
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      console.log('Cleanup function called');
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
      console.log('Aborting request');
    };
  }, []);

  return {
    isLoading,
    error,
    clearError,
    sendRequest,
  };
};

export default useHttpClient;
