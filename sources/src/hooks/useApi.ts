import { useCallback, useEffect, useRef, useState } from 'react';

export type ApiRequest = {
  url: string;
  method: 'GET' | 'POST';
  params?: Record<string, any> | null;
  body?: any;
  sendRequestOnLoad?: boolean;
};

export type ApiResult<TModel> = {
  data: TModel | null;
  error?: string | null;
  isLoading: boolean;
  fetchData: (request?: ApiRequest) => Promise<void>;
};

export const useApi = <TModel>(request: ApiRequest): ApiResult<TModel> => {
  const requestRef = useRef<ApiRequest>(request);
  const [response, setResponse] = useState<TModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (apiRequest?: ApiRequest) => {
    if (apiRequest) {
      const updatedRequest: ApiRequest = {
        ...requestRef.current,
        method: apiRequest.method || 'GET',
        params: apiRequest.params ?? null,
        body: apiRequest.body,
      };
      requestRef.current = updatedRequest;
    }

    try {
      setLoading(true);
      const url = requestRef.current.params
        ? `${requestRef.current.url}?${new URLSearchParams(
            requestRef.current.params,
          ).toString()}`
        : requestRef.current.url;

      await fetch(url, {
        method: requestRef.current.method,
        body: requestRef.current.body,
      }).then(async res => {
        if (res.ok) {
          const data = await res.json();
          setResponse(data);
        } else {
          const errorText = await res.text();
          setError(`Error ${res.status}: ${errorText}`);
          setResponse(null);
        }
      });
    } catch (error) {
      setResponse(null);
      setError((error as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onLoad = async () => {
      await fetchData();
    };

    if (requestRef.current.sendRequestOnLoad) {
      onLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data: response, error, isLoading: loading, fetchData };
};
