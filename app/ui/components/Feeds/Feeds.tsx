import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'
import { ScrollArea } from '@mantine/core'
import { getFeeds } from 'data/api/post'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Post } from 'data/models/user'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const Feeds = () => {

    const [posts, setPosts] = useState<Post[]>([])
    const { userProfile } = useUserProfile()

    async function fetchPosts() {
        setPosts(await getFeeds())
    }

    useEffect(()=>{
        fetchPosts()
    },[])

    return (
        <ScrollArea h={'90vh'}>
            <NewPostComponent className='mb-3'/>
            {
                posts.map(p=><PostItem post={p} key={p.id}/>)
            }
        </ScrollArea>
    )
}

export default Feeds