import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextProvider } from "./auth-context";
import ModalContextProvider from "./modal-context";
import { Dialog, DialogProps, Notification, NotificationProps } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconInfoCircle } from "@tabler/icons";

const NOTIFICATION_TIMEOUT=5000;

interface IuiNotification {
    type: 'error' | 'info' | 'success' | 'loading',
    message: string
}

interface IAppContext {
    notification?: IuiNotification,
    setError: (error: Error) => any,
    setInfo: (info: string) => any
    setSuccess: (msg: string) => any
    setLoading: (msg: string) => any,
    getNotificationProps: () => NotificationProps
}

const defaultAppContext: IAppContext = {
    setError() {
    },
    setInfo(info: string) {
    },
    setSuccess(msg: string) {
    },
    setLoading(msg) {
    },
    getNotificationProps() {
        return {}
    }
}

const AppContext = createContext<IAppContext>(defaultAppContext)

interface IAppContextProviderProps {
    children?: React.ReactNode
    [key: string]: any
}

const AppContextProvider = ({ children }: IAppContextProviderProps) => {

    const [notification, setNotification] = useState<IuiNotification>()

    useEffect(()=>{
        if(notification && notification.type!=='loading'){
            const timeout=setTimeout(()=>{
                setNotification(undefined)
            },NOTIFICATION_TIMEOUT)
    
            return ()=>{
                clearTimeout(timeout)
            }
        }
    },[notification])

    const getNotificationProps = (): NotificationProps => {
        if (!notification) return defaultProps;

        switch (notification.type) {
            case 'error': return {
                ...defaultProps,
                icon: <IconAlertTriangle />,
                title: 'Error occured',
                color:'red'
            }
            case 'success': return {
                ...defaultProps,
                icon: <IconCheck />,
                title: 'Success',
                color:'green'
            }
            case 'loading': return {
                ...defaultProps,
                loading: true,
                title: 'Please wait',
            }
            default: return defaultProps
        }
    }


    const value: IAppContext = {
        notification,
        setError: (error) => {
            setNotification({
                type: 'error',
                message: (error as Error).message
            })
        },
        setInfo(message) {
            setNotification({
                type: 'info',
                message
            })
        },
        setLoading(message) {
            setNotification({
                type: 'loading',
                message
            })
        },
        setSuccess(message) {
            setNotification({
                type: 'success',
                message
            })
        },
        getNotificationProps
    }

    const defaultProps: DialogProps = {
        opened: false,
        onClose: () => setNotification(undefined),
        withCloseButton: true,
        withBorder: true,
    }

    return (<AppContext.Provider value={value}>
        <AuthContextProvider>
            <ModalContextProvider>
                {children}
                {
                    notification &&
                    <Dialog opened={!!notification} p={0} position={{top:70,right:10}}>
                        <Notification {...getNotificationProps()}>
                            {notification.message}
                        </Notification>
                    </Dialog>
                }
            </ModalContextProvider>
        </AuthContextProvider>
    </AppContext.Provider>)
}

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);