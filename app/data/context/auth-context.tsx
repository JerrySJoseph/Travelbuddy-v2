/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, FC, useEffect, useState } from "react";
import { User, getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from "next/router";
import LoadingFragment from "../../ui/sections/Loading";
import { LoadingOverlay } from "@mantine/core";
import {app} from '../../firebase/init'

type AuthContextProps = {
    user: User | null,
    isAuthenticated?: boolean,
    loading:boolean,
    login: (email: string, password: string) => any,
    logout: () => any
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    isAuthenticated: false,
    loading:false,
    login: () => {},
    logout: () => {},
});

export const AuthContextProvider: FC<any> = (props) => {

    const {push}=useRouter();
    const [user,setUser]=useState<User|null>(null);
    const [loading,setLoading]=useState<boolean>(true);

    useEffect(()=>{
        console.log('user changed',user)
    },[user])

    useEffect(()=>{

        const unsubscribe=onAuthStateChanged(getAuth(app),(newUser)=>{
            setLoading(true);
            setUser(newUser);
            console.log('auth state changed',user)
            if(!newUser)
                push('/login');
           
            setLoading(false);
        })

        return ()=>unsubscribe();
    },[])

    const value: AuthContextProps = {
        user,
        loading,
        isAuthenticated: user !== null,
        login: (email: string, password: string) => signInWithEmailAndPassword(getAuth(), email, password),
        logout: () => signOut(getAuth())
    }

   

    return <AuthContext.Provider value={value}>
        <LoadingOverlay visible={loading} overlayBlur={2}/>
        {!loading && props.children}
    </AuthContext.Provider>
}