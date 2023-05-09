import React, { createContext, useContext, useState } from "react";
import  {UserProfile, UserProfileOverride } from "../models/user";
import {useTimeout} from 'usehooks-ts'

interface IAppContext{
    error?:Error,
    setError:(error:Error)=>any
}

const defaultAppContext:IAppContext={
   error:undefined,
   setError() {
       
   },
}

const AppContext=createContext<IAppContext>(defaultAppContext)

interface IAppContextProviderProps{
    children?:React.ReactNode
    [key:string]:any
}

const AppContextProvider=({children}:IAppContextProviderProps)=>{

    const [error,setError]=useState<Error>();
    

    const value:IAppContext={
        error,
        setError
    }



    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export default AppContextProvider;

export const useAppContext=()=>useContext(AppContext);