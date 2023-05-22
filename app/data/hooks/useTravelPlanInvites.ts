import { addOnChildAddedListener, addOnChildRemovedListener } from 'Utils/rtdbListeners'
import { acceptFollowRequest, rejectFollowRequest } from 'data/api/relationships'
import { TravelPlanInvite } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useTravelPlanInvites = () => {

    const [invites, setRequests] = useState<TravelPlanInvite[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const { currentUser } = getAuth()


    useEffect(() => {
        try {
            if (currentUser){
                const unsubOnAddChild= addOnChildAddedListener<TravelPlanInvite>('travel-plan-invites/' + currentUser.uid, (newTravelPlan) => {
                    setRequests([...invites,newTravelPlan])
                    setLoading(false)
                })
                const unsubOnRemoveChild= addOnChildRemovedListener<TravelPlanInvite>('travel-plan-invites/' + currentUser.uid, (removedRequest) => {
                    setRequests(invites.filter(r=>r.id===removedRequest.id))
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
        invites,
        loading,
        error,
        acceptFollowRequest,
        rejectFollowRequest
    }

}