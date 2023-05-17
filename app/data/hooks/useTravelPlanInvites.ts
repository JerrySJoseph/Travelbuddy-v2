import { DataSnapshot, getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { TravelPlanInvite } from 'data/models/user'
import { getAuth } from 'firebase/auth'

export const useTravelPlanInvites = () => {

    const [invites, setInvites] = useState<TravelPlanInvite[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const [newData, setNewData] = useState<boolean>()

    const handleSnapshot = (snap: DataSnapshot) => {
        setLoading(true)
        const nlist: TravelPlanInvite[] = []
        snap.forEach(notif => {
            nlist.push(notif.val())
        })
        setInvites(nlist)
        setLoading(false)
    }

    const handleError = (error: Error) => setError

    useEffect(() => {
        const userid=getAuth().currentUser?.uid
        if (!userid) return
        const invitesRef = ref(getDatabase(), 'travel-plan-invites/' + userid+'/invites')
        const unsubscribe = onValue(invitesRef, handleSnapshot, handleError)
        return unsubscribe;
    }, [])

    return {
        invites, 
        loading, 
        error, 
        newData,
        markSeen: () => {
            setNewData(false)
        }
    }

}