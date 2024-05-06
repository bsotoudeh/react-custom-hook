import { useState, useEffect } from "react";

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useFetchRequest = <T>(
  requestFunction: () => Promise<T>,
  dependencies: any[] = []
): [RequestState<T>, () => void] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchKey, setFetchKey] = useState<number>(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const responseData = await requestFunction();
      setData(responseData);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchKey, ...dependencies]);

  const refetch = () => {
    setFetchKey((prevKey) => prevKey + 1);
  };

  return [{ data, loading, error }, refetch];
};

export default useFetchRequest;
