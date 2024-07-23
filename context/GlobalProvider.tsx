import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}: any) => {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const [user, setUser] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then((res) => {
      if(res) {
        setisLoggedIn(true)
        setUser(res)
      } else {
        setisLoggedIn(false)
        setUser(null)
      }
    }).catch((error) => {
      error instanceof Error && console.log(error)
    }).finally(() => {
      setIsLoading(false);
    })
  }, [])

  return (
    <GlobalContext.Provider value={{
      isLoggedIn: isLoggedIn,
      setIsLoggedIn: setisLoggedIn,
      setIsLoading: setIsLoading,
      user: user,
      setUser: setUser,
      isLoading: isLoading
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider;