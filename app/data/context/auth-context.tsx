/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingOverlay } from "@mantine/core";
import { UserProfile } from "data/models/user";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { useRouter } from "next/router";
import { createContext, FC, useEffect, useState } from "react";
import { addOnDocumentChangeListener } from "Utils/firestoreListeners";
import { app } from '../../firebase/init';
import { getUserProfileWithId } from "data/api/profile";

type AuthContextProps = {
    userProfile?: UserProfile,
    isAuthenticated?: boolean,
    loading: boolean,
    login: (email: string, password: string) => any,
    logout: () => any
}

export const AuthContext = createContext<AuthContextProps>({
    userProfile: undefined,
    isAuthenticated: false,
    loading: false,
    login: () => { },
    logout: () => { },
});

export const AuthContextProvider: FC<any> = (props) => {

    const { push ,asPath} = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [userProfile, setUserProfile] = useState<UserProfile|undefined>()
    const [user, setUser] = useState<User | null>()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), setUser)
        return unsubscribe
    }, [])

    // async function fetchData(){
    //     setLoading(true)
    //     user && setUserProfile(await getUserProfileWithId(user.uid))
    //     setLoading(false)
    // }

    useEffect(()=>{
        if(user===undefined){
            setLoading(true)
            return
        }
        else if(!user){
            setLoading(true)
            if(asPath.startsWith('/app'))
                push('/login')
            setUserProfile(undefined)
            setLoading(false)
            return
        }
        else{
            setLoading(true)
            if(asPath.startsWith('/login') || asPath.startsWith('/register'))
                push('/app')
            const unsubscribeProfileChangeListener=addOnDocumentChangeListener<UserProfile>('profiles',user.uid,(newUserProfile)=>{   
                       
                setUserProfile(newUserProfile)
                setLoading(false)
            })
            return unsubscribeProfileChangeListener
        }
    },[user])

    



    const value: AuthContextProps = {
        loading,
        userProfile,
        isAuthenticated: user !== null,
        login: (email: string, password: string) => signInWithEmailAndPassword(getAuth(), email, password),
        logout: () => signOut(getAuth())
    }



    return <AuthContext.Provider value={value}>
        <LoadingOverlay visible={loading} overlayBlur={2} />
        {!loading && props.children}
    </AuthContext.Provider>
}