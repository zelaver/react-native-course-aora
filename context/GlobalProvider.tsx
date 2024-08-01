import { getAllPost, getCurrentUser } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { createContext, useContext, useState, useEffect } from "react";

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoadingUser: boolean;
  setIsLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
  posts: any;
  refetch: () => Promise<void>;
  isLoadingPost: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const { data: posts, isLoadingPost, refetch } = useAppwrite(getAllPost);
  const [user, setUser] = useState<any>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // console.log(posts);
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setisLoggedIn(true);
          setUser(res);
        } else {
          setisLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        error instanceof Error && console.log(error);
      })
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setisLoggedIn,
        setIsLoadingUser: setIsLoadingUser,
        isLoadingUser: isLoadingUser,
        user: user,
        setUser: setUser,
        posts: posts,
        isLoadingPost: isLoadingPost,
        refetch: refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
