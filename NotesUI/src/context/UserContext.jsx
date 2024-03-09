import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export const UseUserContext = () => { return useContext(UserContext) }

export default function UserContextProvider({children}){

    let [user, setUser] = useState(undefined);

    return <UserContext.Provider value={{value : user, setter : setUser}}>{children}</UserContext.Provider>

}