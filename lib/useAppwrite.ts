import { useEffect, useState } from "react";
import { getAllPost } from "./appwrite";
import { Alert } from "react-native";

const useAppwrite = (fn: CallableFunction) => {
  const [data, setData] = useState<any>([]);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  const fetchData = async () => {
    setIsLoadingPost(true);

    try {
      const response = await fn();

      setData(response);
    } catch (e) {
      if (e instanceof Error) {
        Alert.alert("errors", e.message);
      }
    } finally {
      setIsLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, refetch, isLoadingPost };
};

export default useAppwrite;
