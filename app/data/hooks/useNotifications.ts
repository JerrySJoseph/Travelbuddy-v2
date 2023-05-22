import { addOnChildAddedListener, addOnChildRemovedListener } from 'Utils/rtdbListeners'
import { Notification } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export const useNotifications = () => {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const [lastUpdate,setLastUpdate]=useLocalStorage('notif-last-update',0)
    const [lastSeen,setLastSeen]=useLocalStorage('notif-last-seen',0)
    const { currentUser } = getAuth()


    useEffect(() => {
        try {
            if (currentUser){
                const unsubOnAddChild= addOnChildAddedListener<Notification>('notifications/' + currentUser.uid, (newFollowRequest) => {
                    setNotifications([...notifications,newFollowRequest])
                    setLastUpdate(Date.now())
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
        error,
        hasNewData:lastUpdate>lastSeen,
        opened:()=>setLastSeen(Date.now())
    }

}