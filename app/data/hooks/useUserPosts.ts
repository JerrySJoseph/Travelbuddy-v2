import { addOnQueryChangeListener } from 'Utils/firestoreListeners'
import { getFeedsCount } from 'data/api/post'
import { Post } from 'data/models/user'
import { collection, getFirestore, limit, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useUserPosts = (userId?:string,max_results:number=50) => {

    const [posts, setPosts] = useState<Post[]>([])
    const [count,setCount]=useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error>()

    async function fetch() {
        if(!userId)
            return;
        const firestore = getFirestore();
        setCount(await getFeedsCount())
        const q = query(collection(firestore, 'posts'),
            where('ownerId', '==', userId),
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
    }, [userId])

    return {
        posts,
        count,
        loading,
        error
    }

}