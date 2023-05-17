import { addOnChildAddedListener, addOnChildRemovedListener } from 'Utils/rtdbListeners'
import { Notification } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useNotifications = () => {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const { currentUser } = getAuth()


    useEffect(() => {
        try {
            if (currentUser){
                const unsubOnAddChild= addOnChildAddedListener<Notification>('notifications/' + currentUser.uid, (newFollowRequest) => {
                    setNotifications([...notifications,newFollowRequest])
                    setLoading(false)
                })
                const unsubOnRemoveChild= addOnChildRemovedListener<Notification>('notifications/' + currentUser.uid, (removedRequest) => {
                    setNotifications(notifications.filter(r=>r.id===removedRequest.id))
                    setLoading(false)
                })
                return ()=>{
                    unsubOnAddChild();
                    unsubOnRemoveChild()
                }
            }
        } catch (error) {
            setError(error as Error)
        }
    }, [currentUser])

    return {
        notifications,
        loading,
        error
    }

}