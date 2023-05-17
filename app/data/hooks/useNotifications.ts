import { DataSnapshot, getDatabase, ref, onChildAdded, onValue } from 'firebase/database'
import { useEffect, useState } from 'react'
import { Notification } from 'data/models/user'
import { getAuth } from 'firebase/auth'

export const useNotifications = (handleOnNewNotification?:(notif:Notification)=>any) => {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
   

    const handleSnapshot = (snap: DataSnapshot) => {
        setLoading(true)

        const nlist: Notification[] = []
        snap.forEach(notif => {
            console.log(notif.val())
            nlist.push(notif.val())
        })
        setNotifications(nlist)
        setLoading(false)

    }

    const handleError = (error: Error) => setError
    const handleOnChildAdded=(dataSnap:DataSnapshot)=>{
        handleOnNewNotification && handleOnNewNotification(dataSnap.val()as Notification)
    }

    useEffect(() => {
        const userid=getAuth().currentUser?.uid

        if (!userid) return
        
        const notificationsRef = ref(getDatabase(), 'notifications/' + userid)
        const unsubscribeOnValue = onValue(notificationsRef, handleSnapshot, handleError)
        const unsubscribeonChildAdd=onChildAdded(notificationsRef,handleOnChildAdded,handleError)
        return ()=>{
            unsubscribeOnValue()
            //unsubscribeonChildAdd()
        };
    }, [])

    return {
        notifications, loading, error
    }

}