import LikeButton from '@components/LikeButton/LikeButton'
import LikesBanner from '@components/LikesBanner/LikesBanner'
import { Carousel } from '@mantine/carousel'
import { ActionIcon, Avatar, Button, Divider, Image, Menu, Skeleton, Text, Textarea, ThemeIcon, UnstyledButton } from '@mantine/core'
import { AvatarGroup } from '@mantine/core/lib/Avatar/AvatarGroup/AvatarGroup'
import { IconCar, IconDotsVertical, IconMenu, IconMenu2, IconPlus, IconSend, IconTrash } from '@tabler/icons'
import { getFormattedDate } from 'Utils/dateutils'
import { addComment, getComments, getCommentsCount } from 'data/api/post'
import { getShortProfile } from 'data/api/profile'
import { useAppContext } from 'data/context/app-context'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Like, Post, ShortProfile, UserComment } from 'data/models/user'
import { useEffect, useState } from 'react'
import { Tex } from 'tabler-icons-react'

export interface IPostItemProps {
    post: Post,
    showEditMenu?: boolean
}

const PostItem = ({ post, showEditMenu = false }: IPostItemProps) => {

    const { userProfile } = useUserProfile();
    const [currentPost, setCurrenPost] = useState<Post>(post);

    const [loading, setLoading] = useState<boolean>(false);
    const [owner, setOwner] = useState<ShortProfile>()
    const { setError } = useAppContext();

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            setOwner(await getShortProfile(post.ownerId))
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

    return (
        <div className="card p-0 rounded-4 mb-3">
            <div className="d-flex p-2">
                <PostHeader ownerId={currentPost.ownerId} showEditMenu={showEditMenu} />
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
                                <small className="text-muted m-0 p-0">  (created by {currentPost.travelPlan.createdBy?.firstname})</small><br />
                                <small className="text-muted">Destinations: {currentPost.travelPlan.destinations.map(d => d.name).join(', ')}</small><br />
                                <small className="text-muted">Dates: {getFormattedDate(currentPost.travelPlan.travellingDateRange.start)} - {getFormattedDate(currentPost.travelPlan.travellingDateRange.end)}</small>
                            </div>
                            {
                                currentPost.travelPlan.group &&
                                <Avatar.Group spacing="xs" mr={7}>
                                    {
                                        currentPost.travelPlan.group.members.map(pr => <Avatar key={pr.id} src={pr.avatar} radius="xl" size='sm' />)
                                    }
                                </Avatar.Group>
                            }
                        </div>
                        <Button radius='xl' compact >Join {currentPost.travelPlan.createdBy?.firstname}</Button>
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



interface HeaderProps {
    ownerId: string,
    showEditMenu: boolean
}
function PostHeader({ ownerId, showEditMenu }: HeaderProps) {
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
        <div className="d-flex align-items-center">
            <Avatar src={owner?.avatar} radius='xl' />
            <div className='ms-2'>
                <Text tt='capitalize' lh={1}>{owner?.firstname} {owner?.lastname}</Text>
                <Text color='dimmed' size='xs'>@{owner?.username}</Text>
            </div>
        </div>
        {
            showEditMenu &&
            <Menu shadow="md"  >
                <Menu.Target>
                    <ActionIcon radius='xl'>
                        <IconDotsVertical size={18} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconTrash size={18} />} color='red'>
                        Delete this post
                    </Menu.Item>
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

export default PostItem