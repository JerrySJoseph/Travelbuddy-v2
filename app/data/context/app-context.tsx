import React, { createContext, useContext, useState } from "react";
import  {UserProfile, UserProfileOverride } from "../models/user";
import {useTimeout} from 'usehooks-ts'

interface IAppContext{
    currentUserProfile?:UserProfile,
    isAuthenticated:Boolean
}

const defaultAppContext:IAppContext={
    currentUserProfile:undefined,
    isAuthenticated:false
}

const AppContext=createContext<IAppContext>(defaultAppContext)

interface IAppContextProviderProps{
    children?:React.ReactNode
    [key:string]:any
}

const AppContextProvider=({children}:IAppContextProviderProps)=>{

    const [currentUserProfile,setcurrentUserProfile]=useState();
    const [isAuthenticated,setIsAuthenticated]=useState<Boolean>(false)

    const value:IAppContext={
        currentUserProfile,
        isAuthenticated
    }



    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export default AppContextProvider;

export const useAppContext=()=>useContext(AppContext);