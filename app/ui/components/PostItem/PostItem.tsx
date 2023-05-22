/* eslint-disable react/display-name */
import LikeButton from '@components/LikeButton/LikeButton'
import LikesBanner from '@components/LikesBanner/LikesBanner'
import InterestedMembersList from '@components/interestedMembersList/InterestedMembersList'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Avatar, Button, Divider, Image, LoadingOverlay, Menu, Skeleton, Text, Textarea, ThemeIcon, UnstyledButton } from '@mantine/core'
import { IconCar, IconDotsVertical, IconSend, IconTrash, IconUsers } from '@tabler/icons'
import { getFormattedDate } from 'Utils/dateutils'
import { capitalizeFirstLetter } from 'Utils/stringutils'
import { addComment, checkRequestedToJoin, deletePost, getComments, getCommentsCount, joinTravelPlan } from 'data/api/post'
import { getShortProfile } from 'data/api/profile'
import { useAppContext } from 'data/context/app-context'
import { useModal } from 'data/context/modal-context'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Like, Post, ShortProfile, TravelPlan, UserComment } from 'data/models/user'
import { getAuth } from 'firebase/auth'
import { memo, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export interface IPostItemProps {
    post: Post,
    showEditMenu?: boolean,
    ondeleteClick?: () => any
}

const PostItem = ({ post, showEditMenu = false, ondeleteClick = () => { } }: IPostItemProps) => {

    const { userProfile } = useUserProfile();
    const [currentPost, setCurrenPost] = useState<Post>(post);

    const [loading, setLoading] = useState<boolean>(false);
    const [owner, setOwner] = useState<ShortProfile>()

    const [loadingJoin, setLoadingJoin] = useState<boolean>(false)
    const [joined, setJoined] = useState<boolean>(false);
    const [requestedJoin, setRequestedJoin] = useState<boolean>(false)

    const { openModal } = useModal()

    const { setError } = useAppContext();

    useEffect(() => {
        fetchData()

    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            setOwner(await getShortProfile(post.ownerId))
            setRequestedJoin(await checkRequestedToJoin(post.id))
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }


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

    async function handleJoinClick() {
        try {
            setLoadingJoin(true)
            await joinTravelPlan(post.id)
            setJoined(true)
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoadingJoin(false)
        }
    }

    function handleOnInterestedMembersJoinClick() {
        openModal({
            title: 'Interested Members',
            content: <InterestedMembersList postId={currentPost.id}/>
        })
    }

    if (loading) {
        <div className="card p-4 rounded-4 mb-3">
            <LoadingOverlay visible />
        </div>
    }

    return (
        <div className="card p-0 rounded-4 mb-3">
            <div className="d-flex p-2">
                <PostHeader ownerId={currentPost.ownerId} showEditMenu={showEditMenu} onDeleteClick={ondeleteClick} showInterestUsersList={!!currentPost.travelPlan}
                    onInterestedMembersClick={handleOnInterestedMembersJoinClick} />
            </div>
            <Divider />


            {
                currentPost.medias && currentPost.medias.length > 0 &&
                <>
                    <div className="d-flex p-2">
                        <Carousel mx="auto" withControls={currentPost.medias.length > 1}>
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
            {
                currentPost.travelPlan &&
                <div className="card p-2 m-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <ThemeIcon>
                                <IconCar size={18} />
                            </ThemeIcon>
                            <div className='ms-2 lh-1'>
                                <strong className='text-capitalize m-0 p-0 fw-bold h6 text-muted'>{currentPost.travelPlan.group.name}</strong>
                                <small className="text-muted m-0 p-0">  ({currentPost.travelPlan.isPrivate ? 'Private' : 'Public'})</small><br />
                                <small className="text-muted">Destinations: {currentPost.travelPlan.destinations.map(d => d.name).join(', ')}</small><br />
                                <small className="text-muted">Dates: {getFormattedDate(currentPost.travelPlan.travellingDateRange.start)} - {getFormattedDate(currentPost.travelPlan.travellingDateRange.end)}</small>
                                {
                                    currentPost.travelPlan.group &&
                                    <Avatar.Group spacing="xs" mr={7}>
                                        {
                                            currentPost.travelPlan.group.members.map(pr => <Avatar key={pr.id} src={pr.avatar} radius="xl" size='sm' />)
                                        }
                                    </Avatar.Group>
                                }
                            </div>

                        </div>
                        {currentPost.travelPlan && <JoinButton post={currentPost}/>}
                        
                    </div>
                </div>
            }
            <Divider />
            <div className="p-2">
                <div className="d-flex">
                    <LikeButton post={post} onLikeAdded={handleLikeAdded} onLikeRemoved={handleLikeRemoved} />
                    <ActionIcon>
                        <IconSend size={18} />
                    </ActionIcon>
                </div>
                <div className="d-flex my-2">
                    <Text size='sm' ml={5}><strong>{owner?.username}</strong> {currentPost.text}</Text>
                </div>
                {
                    currentPost.travelPlan?.summary &&
                    <>
                        <div className="d-flex my-2">
                            <Text size='sm' ml={5} color='dimmed'>Trip Summary</Text>

                        </div>
                        <div className="d-flex mb-2">
                            <Text size='sm' lineClamp={2}>
                                {currentPost.travelPlan.summary}
                            </Text>
                            <p></p>
                        </div>
                    </>
                }
                <LikesBanner likesIndex={currentPost.likeIndex || []} />

            </div>
            <div className="p-2">
                <CommentComponent post={currentPost} />
            </div>
        </div>
    )
}


interface JoinButtonProps {
    post: Post
}
const JoinButton = ({ post }: JoinButtonProps) => {

    
    const [loading, setLoading] = useState<boolean>(false);
    const [joined, setJoined] = useState<boolean>(false);
    const [invited, setInvited] = useState<boolean>(false);
    const {setError}=useAppContext();

    const user = getAuth().currentUser

    useEffect(() => {
        if (user && post.travelPlan && post.travelPlan.inviteMembers.includes(user?.uid))
            setInvited(true);
        if (post.travelPlan &&post.travelPlan.group.members.find(m => m.id === user?.uid))
            setJoined(true);

    })


    async function handleJoinClick(){
        try {
            setLoading(true)
            await joinTravelPlan(post.id)
            setJoined(true)
        } catch (error) {
            setError(error as Error)
        } finally{
            setLoading(false);
        }
    }

    if (joined)
        return <Button compact disabled radius='xl'>Joined</Button>
    if (invited)
        return <Button compact disabled radius='xl'>{capitalizeFirstLetter(post.travelPlan?.owner?.firstname||'')} invited you </Button>

    return <Button compact loading={loading} radius='xl' onClick={handleJoinClick}>Join {post.travelPlan?.owner?.firstname}</Button>

}



interface HeaderProps {
    ownerId: string,
    showEditMenu: boolean,
    showInterestUsersList: boolean,
    onInterestedMembersClick: () => any,
    onDeleteClick?: () => any
}
function PostHeader({ ownerId, showEditMenu, onDeleteClick, showInterestUsersList = false, onInterestedMembersClick = () => { } }: HeaderProps) {
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


    return <div className="d-flex align-items-center justify-content-between p-2 w-100">
        <Link href={`/app/profile/${ownerId}`} className="d-flex align-items-center">
            <Avatar src={owner?.avatar} radius='xl' />
            <div className='ms-2'>
                <Text tt='capitalize' lh={1}>{owner?.firstname} {owner?.lastname}</Text>
                <Text color='dimmed' size='xs'>@{owner?.username}</Text>
            </div>
        </Link>
        {

            <Menu shadow="md"  >
                <Menu.Target>
                    <ActionIcon radius='xl'>
                        <IconDotsVertical size={18} />
                    </ActionIcon>
                </Menu.Target>


                <Menu.Dropdown>
                    {(ownerId === getAuth().currentUser?.uid) &&
                        <>

                            {showInterestUsersList && <Menu.Item icon={<IconUsers size={18} />} onClick={onInterestedMembersClick}>
                                View all interested users
                            </Menu.Item>}
                            <Menu.Item icon={<IconTrash size={18} />} color='red' onClick={onDeleteClick}>
                                Delete this post
                            </Menu.Item>
                        </>
                    }
                </Menu.Dropdown>

            </Menu>
        }
    </div>
}

interface CommentComponentProps {
    post: Post
}
const CommentComponent = ({ post }: CommentComponentProps) => {
    const [comments, setComments] = useState<UserComment[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [openAddComment, setOpenAddComment] = useState<boolean>(false)
    const [count, setCount] = useState<number>(0)
    const [content, setContent] = useState<string>('');
    const [postingComment, setPostingComment] = useState<boolean>(false);

    const { setError } = useAppContext();
    const { userProfile } = useUserProfile();

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            setCount(await getCommentsCount(post.id))
            const newComments = await getComments(post.id, comments[comments.length - 1], 2)
            setComments([...comments, ...newComments])
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    async function handleAddComment() {
        try {
            setPostingComment(true)
            const newComment = await addComment(post.id, content)
            setCount(count + 1)
            setComments([newComment, ...comments])
            setContent('')
        } catch (error) {
            setError(error as Error)
        } finally {
            setPostingComment(false)
        }
    }

    if (loading)
        return <div className="d-flex">
            <Skeleton radius='xl' width={20} height={20} mr='sm' />
            <Skeleton radius='md' height={40} width='80%' />
        </div>

    return <div>
        <UnstyledButton onClick={() => setOpenAddComment(!openAddComment)}>
            <Text color='dimmed' size='sm' mb='sm' onClick={() => { }}>{count} comments</Text>
        </UnstyledButton>
        {
            openAddComment && comments.map(c => (
                <CommentItem comment={c} key={c.id} />
            ))

        }
        {
            openAddComment && comments.length < count &&
            <UnstyledButton onClick={fetchData}>
                <Text color='dimmed' size='sm' mb='sm' onClick={() => { }}>Add more comments</Text>
            </UnstyledButton>

        }
        {
            openAddComment &&
            <>
                <div className="d-flex mb-2">
                    <Avatar src={userProfile?.avatar} size='sm' mr='sm' radius='xl' />
                    <Textarea className='w-100' radius='lg' placeholder='Add comments' value={content} onChange={e => setContent(e.target.value)} />
                </div>
                <Button compact radius='xl' className='float-end' disabled={content.length == 0} loading={postingComment} onClick={handleAddComment}>Post comment</Button>
            </>
        }
    </div>


}

interface CommentItemProps {
    comment: UserComment
}
const CommentItem = ({ comment }: CommentItemProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [owner, setOwner] = useState<ShortProfile>()
    const { setError } = useAppContext();

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            setOwner(await getShortProfile(comment.ownerId))
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    if (loading)
        return <div className="d-flex">
            <Skeleton radius='xl' width={20} height={20} mr='sm' />
            <Skeleton radius='md' height={20} width='70%' />
        </div>

    return (
        <div className="d-flex mb-2">
            <Avatar src={owner?.avatar} size='sm' mr='sm' />
            <Text color='dimmed' size='sm'><strong>{owner?.username}</strong> {comment.content}</Text>
        </div>
    )
}

export default memo(({ post }: IPostItemProps) => <PostItem post={post} />)