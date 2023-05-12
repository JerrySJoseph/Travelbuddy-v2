/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, FC, useEffect, useState } from "react";
import { User, getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from "next/router";
import LoadingFragment from "../../ui/sections/Loading";
import { LoadingOverlay } from "@mantine/core";
import { app } from '../../firebase/init'
import { UserProfile } from "data/models/user";
import { getUserProfileWithId } from "data/api/profile";

type AuthContextProps = {
    user?: User,
    userProfile?: UserProfile,
    isAuthenticated?: boolean,
    loading: boolean,
    login: (email: string, password: string) => any,
    logout: () => any
}

export const AuthContext = createContext<AuthContextProps>({
    user: undefined,
    userProfile: undefined,
    isAuthenticated: false,
    loading: false,
    login: () => { },
    logout: () => { },
});

export const AuthContextProvider: FC<any> = (props) => {

    const { push } = useRouter();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState<boolean>(true);
    const [userProfile, setUserProfile] = useState<UserProfile>()


    useEffect(() => {

        const unsubscribe = onAuthStateChanged(getAuth(app), async (newUser) => {
            setLoading(true);
            setUser(newUser ? newUser : undefined);
            if (newUser) {
                const profile = await getUserProfileWithId(newUser.uid)
                setUserProfile(profile)
            }
            if (!newUser)
                push('/login');

            setLoading(false);
        })

        return () => unsubscribe();
    }, [])

    const value: AuthContextProps = {
        user,
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