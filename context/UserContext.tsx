import { UserData } from '@/interface/User';
import React, { createContext, ReactNode, useState } from 'react';

interface UserContextType {
    user: UserData | undefined;
    setUser: (user: UserData | undefined) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}:{children: ReactNode}) => {
    const [user, setUser] = useState<UserData | undefined>(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider> 
  )
}

export const useUserContext = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}