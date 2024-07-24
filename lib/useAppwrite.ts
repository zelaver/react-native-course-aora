import { useEffect, useState } from "react";
import { getAllPost } from "./appwrite";
import { Alert } from "react-native";

const useAppwrite = (fn: CallableFunction) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await fn();

      setData(response);
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("errors", e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, refetch, isLoading };
};

export default useAppwrite;
