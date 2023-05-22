import { addOnChildAddedListener, addOnChildRemovedListener } from 'Utils/rtdbListeners'
import { acceptFollowRequest, rejectFollowRequest } from 'data/api/relationships'
import { ShortProfile } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useInterestedMembers = (postId:string) => {

    const [users, setUsers] = useState<ShortProfile[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const { currentUser } = getAuth()


    useEffect(() => {
        try {
            if (currentUser){
                const unsubOnAddChild= addOnChildAddedListener<ShortProfile>('travel-plan-interests/' + postId, (newTravelPlan) => {
                    setUsers([...users,newTravelPlan])
                    setLoading(false)
                })
                const unsubOnRemoveChild= addOnChildRemovedListener<ShortProfile>('travel-plan-interests/' + postId, (removedRequest) => {
                    setUsers(users.filter(r=>r.id===removedRequest.id))
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
        users,
        loading,
        error,
        acceptFollowRequest,
        rejectFollowRequest
    }

}