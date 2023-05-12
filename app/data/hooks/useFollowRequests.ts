import { addOnDataChangeListener } from 'Utils/rtdbListeners'
import { acceptFollowRequest, rejectFollowRequest } from 'data/api/relationships'
import { FollowRequest } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useFollowRequests = () => {

    const [requests, setRequests] = useState<FollowRequest[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const { currentUser } = getAuth()


    useEffect(() => {
        try {
            if (currentUser)
                return addOnDataChangeListener<FollowRequest>('follow-requests/' + currentUser.uid, (newFollowRequests) => {
                    setRequests(newFollowRequests)
                    setLoading(false)
                })
        } catch (error) {
            setError(error as Error)
        }
    }, [currentUser])

    return {
        requests,
        loading,
        error,
        acceptFollowRequest,
        rejectFollowRequest
    }

}