import { addOnQueryChangeListener } from 'Utils/firestoreListeners'
import { getFeedsCount } from 'data/api/post'
import {  ShortProfile, Post } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { collection, getDocs, getFirestore, limit, or, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useFeeds = (max_results:number=50) => {

    const [posts, setPosts] = useState<Post[]>([])
    const [count,setCount]=useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()
    const { currentUser } = getAuth()

    async function fetch() {
        if (!currentUser) return ()=>{};
        const firestore = getFirestore();
        setCount(await getFeedsCount())
        const followingsSnapshot = await getDocs(collection(firestore, 'profiles', currentUser.uid, 'following'))
        const followings = followingsSnapshot.docs.map(doc => (doc.data() as ShortProfile).id)
        followings.push(currentUser.uid)
        const q = query(collection(firestore, 'posts'),
            or(
                where('ownerId', 'in', followings),
                where('travelPlan.isPrivate', '==', false),
            ),
            orderBy('datetime', 'desc'),
            limit(max_results))
        addOnQueryChangeListener<Post>(q, (posts) => {
            const tp:Post[]=[]
            posts.forEach(p=>tp.push(p))
            setPosts(tp);
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
        posts,
        count,
        loading,
        error
    }

}