import LikeButton from '@components/LikeButton/LikeButton'
import LikesBanner from '@components/LikesBanner/LikesBanner'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Avatar, Button, Divider, Image, Skeleton, Text, Textarea } from '@mantine/core'
import { IconSend } from '@tabler/icons'
import { getShortProfile } from 'data/api/profile'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Like, Post, ShortProfile } from 'data/models/user'
import { useEffect, useState } from 'react'

export interface IPostItemProps {
    post: Post
}

const PostItem = ({ post }: IPostItemProps) => {

    const { userProfile } = useUserProfile();
    const [currentPost, setCurrenPost] = useState<Post>(post);


    function handleLikeAdded(likeObject: Like) {
        if (userProfile)
            setCurrenPost({
                ...post,
                likeCount: currentPost.likeCount + 1,
                likeIndex: [...(currentPost.likeIndex || []), likeObject.ownerId]
            })
    }
    function handleLikeRemoved() {
        if (userProfile)
            setCurrenPost({
                ...post,
                likeCount: Math.min(currentPost.likeCount - 1, 0),
                likeIndex: currentPost.likeIndex.filter(id => id !== userProfile.id)
            })
    }

    return (
        <div className="card p-0 rounded-4 mt-3">
            <div className="d-flex p-2">
                <PostHeader ownerId={currentPost.ownerId} />
            </div>
            <Divider />
            {
                currentPost.medias && currentPost.medias.length > 0 &&
                <>
                    <div className="d-flex p-2">
                        <Carousel mx="auto" withControls={currentPost.medias.length>1}>
                            {
                                currentPost.medias && currentPost.medias.map(item => (
                                    <Carousel.Slide key={item.mediaUrl}>
                                        <Image src={item.mediaUrl} fit='contain' height={400} alt='x' />
                                    </Carousel.Slide>
                                ))
                            }
                        </Carousel>

                    </div>
                    <Divider />
                </>
            }

            <div className="p-2">
                <div className="d-flex">
                    <LikeButton post={post} onLikeAdded={handleLikeAdded} onLikeRemoved={handleLikeRemoved} />
                    <ActionIcon>
                        <IconSend size={18} />
                    </ActionIcon>
                </div>
                <div className="d-flex my-2">
                    <Text size='sm' ml={5}>{currentPost.text}</Text>
                </div>
                <LikesBanner likesIndex={currentPost.likeIndex || []} />

            </div>
            <div className="p-2">
                <div className="d-flex mb-2">
                    <Avatar src={userProfile?.avatar} size='sm' mr='sm' />
                    <Textarea className='w-100' radius='lg' placeholder='Add comments' />
                </div>
                <Button compact radius='xl' className='float-end'>Post comment</Button>
            </div>
        </div>
    )
}



interface HeaderProps {
    ownerId: string,
}
function PostHeader({ ownerId }: HeaderProps) {
    const [loading, setLoading] = useState<boolean>(true)
    const [owner, setOwner] = useState<ShortProfile>()

    useEffect(() => {
        fetchData()
    }, [ownerId])

    const fetchData = async () => {
        setLoading(true)
        setOwner(await getShortProfile(ownerId))
        setLoading(false)
    }

    if (loading)
        return <div className="d-flex">
            <Skeleton radius='xl' width={20} mr='sm' />
            <Skeleton radius='md' height={20} width='70%' />
        </div>


    return <div className="d-flex p-2">
        <Avatar src={owner?.avatar} radius='xl' />
        <div className='ms-2'>
            <Text tt='capitalize' lh={1}>{owner?.firstname} {owner?.lastname}</Text>
            <Text color='dimmed' size='xs'>@{owner?.username}</Text>
        </div>
    </div>
}



export default PostItem