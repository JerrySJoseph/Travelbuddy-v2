import { ActionIcon } from '@mantine/core'
import { IconHeart } from '@tabler/icons'
import { likePost, removeLike } from 'data/api/post'
import { useAppContext } from 'data/context/app-context'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Like, Post } from 'data/models/user'
import React, { useEffect, useState } from 'react'

interface LikeButtonProps {
    post: Post,
    onLikeAdded?:(like:Like)=>any
    onLikeRemoved?:()=>any
}
const LikeButton = ({ post,onLikeAdded=()=>{},onLikeRemoved=()=>{} }: LikeButtonProps) => {
    
    const [liked, setLiked] = useState<boolean>(false)
    const [loading,setLoading]=useState<boolean>(false)

    const { userProfile } = useUserProfile();
    const {setError}=useAppContext()

    useEffect(()=>{
       
        if(post.likeIndex && userProfile){
            console.log('likeindex',post.likeIndex)
            setLiked(post.likeIndex.findIndex(id=>id===userProfile.id)>-1)
        }
    },[post])


    async function handleLikeClick(){
        try {
            if(!liked){
                setLoading(true)
                onLikeAdded(await likePost(post.id))
                setLiked(true)
                setLoading(false) 
            }else{
                setLoading(true)
                await removeLike(post.id)
                onLikeRemoved()
                setLiked(false)
                setLoading(false)
            }
        } catch (error) {
            setError((error as Error))
        }
    }


    return (
        <ActionIcon color='red' variant={!liked ? 'subtle' : 'filled'} radius='xl' onClick={handleLikeClick} loading={loading}>
            <IconHeart size={18} />
        </ActionIcon>
    )
}

export default LikeButton