import { Avatar, Button, Card, Divider, Loader, Text } from '@mantine/core'
import { UserProfile } from '../../../data/models/user'
import { IconCheck, IconPlus, IconUserCheck, IconUserOff, IconUserPlus } from '@tabler/icons'
import { useAppContext } from 'data/context/app-context'
import { useEffect, useState } from 'react'
import { checkFollowRequestSent, checkifFollowing, sendFollowRequest } from 'data/api/relationships'
import { useAuth } from 'data/hooks/useAuth'

export interface IProfileCardProps {
    profile: UserProfile,
    showFollowButton?: boolean
    [key: string]: any
}

const ProfileCard = ({ profile, showFollowButton = false }: IProfileCardProps) => {

    const [loading, setLoading] = useState<boolean>(true)
    const [followRequestSent, setFollowRequestSent] = useState<boolean>(false)
    const [following, setFollowing] = useState<boolean>(false)
    const {user}=useAuth()

    const { setError } = useAppContext();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            setFollowRequestSent(await checkFollowRequestSent(profile.id))
            setFollowing(await checkifFollowing(profile.id))
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    const handleFollowButtonClick = async () => {
        try {
            setLoading(true)
            setFollowRequestSent(await sendFollowRequest(profile.id))
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Card shadow='md'>
            <div className="d-flex justify-content-center align-items-center pt-4">
                <Avatar src={profile.avatar} size='xl' />
            </div>


            <div className="text-center">
                <h5 className="h4 m-0 p-0 text-capitalize">{profile.firstname} {profile.lastname}</h5>
                <Text fw={300} className='text-muted mb-2'>@{profile.username}</Text>
                <Divider />
                {
                    profile.bio ?
                        <p className="fs-6 my-3">{profile.bio}</p> :
                        <p className="fs-6 m-4 text-muted fst-italic"><span className='text-capitalize'>{profile.id===user?.uid?'You':profile.firstname}</span> do not have any bio yet.</p>
                }
                {
                    (!profile.bio && profile.id===user?.uid) &&
                    <Button compact variant='outline' mb='lg' leftIcon={<IconPlus size={12}/>} size='xs'>Add bio</Button>}
                <Divider />
                <div className="row">
                    <div className="col-lg-6 text-center border-end py-3">
                        <p className="fs-5 text-muted fw-bold m-0 p-0">{profile.followersCount}</p>
                        <p className="fs-6 text-muted m-0 p-0">Followers</p>
                    </div>
                    <div className="col-lg-6 text-center py-3">
                        <p className="fs-5 text-muted fw-bold m-0 p-0">{profile.followedCount}</p>
                        <p className="fs-6 text-muted m-0 p-0">Following</p>
                    </div>
                </div>
                {
                    showFollowButton &&
                    <>
                        <Divider />
                        {
                            followRequestSent ?
                                <Button variant='outline' my='lg' disabled leftIcon={<IconUserCheck size={15} />}>Follow request sent</Button> :
                                following ? <Button variant='outline' my='lg' disabled leftIcon={<IconUserCheck size={15} />}>Following</Button> : <Button variant='outline' my='lg' leftIcon={loading ? <Loader size={15} /> : <IconUserPlus size={15} />} onClick={handleFollowButtonClick}>Follow<span className='text-capitalize ms-1'>{profile.firstname}</span></Button>
                        }

                    </>
                }
            </div>
        </Card>
    )
}

export default ProfileCard