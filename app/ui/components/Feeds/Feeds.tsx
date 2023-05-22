import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'
import { Button, ScrollArea } from '@mantine/core'
import { getFeeds, getFeedsCount } from 'data/api/post'
import { Post } from 'data/models/user'
import { useEffect, useState } from 'react'

const Feeds = () => {

    const [posts, setPosts] = useState<Post[]>([])
    const [count,setCount]=useState<number>(0)
    
    async function fetchPosts() {
        setPosts([...posts,...(await getFeeds())])
        setCount(await getFeedsCount())
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    async function getNextFeeds(){
        const newFeeds=await getFeeds(posts[posts.length-1],20)
        setPosts([...posts,...newFeeds])
    }


    return (
        <ScrollArea h={'90vh'}>
            <NewPostComponent className='mb-3' />
            {
                posts.map(p => <PostItem post={p} key={p.id} />)
            }
            {
                posts.length<count &&
                <Button variant='outline' onClick={getNextFeeds}>Load More</Button>
            }
        </ScrollArea>
    )
}

export default Feeds