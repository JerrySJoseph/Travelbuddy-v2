import { addOnQueryChangeListener } from 'Utils/firestoreListeners'
import { Post, ShortProfile, TravelPlan } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, getFirestore, limit, or, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useFriendsTravelling = () => {

    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const { currentUser } = getAuth()

    async function fetch() {
        if (!currentUser) return ()=>{};
        const firestore = getFirestore()
        const followingsSnapshot = await getDocs(collection(firestore, 'profiles', currentUser.uid, 'following'))
        const followings = followingsSnapshot.docs.map(doc => (doc.data() as ShortProfile).id)
        followings.push(currentUser.uid)
        const q = query(collection(firestore, 'posts'),
            or(
                where('ownerId', 'in', followings),
                where('travelPlan.isPrivate','==',false)
            ),
            orderBy('datetime', 'desc'),
            limit(4))
        addOnQueryChangeListener<Post>(q, (posts) => {
            const tp:TravelPlan[]=[]
            posts.forEach(p=>{
                if(p.travelPlan)
                    tp.push(p.travelPlan)
            })
            setTravelPlans(tp);
        })
    }

    useEffect(() => {
        try {
            fetch()
        } catch (error) {
            setError(error as Error)
        }
    }, [currentUser])

    return {
        travelPlans,
        loading,
        error
    }

}