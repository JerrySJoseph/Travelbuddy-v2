import { ActionIcon, Avatar, Button, Card, Divider, Loader, NavLink, Text } from '@mantine/core'
import { UserProfile } from '../../../data/models/user'
import { IconCheck, IconLink, IconPencil, IconPlus, IconSquareArrowUp, IconUserCheck, IconUserCircle, IconUserExclamation, IconUserOff, IconUserPlus, IconUserX } from '@tabler/icons'
import { useAppContext } from 'data/context/app-context'
import { useEffect, useState } from 'react'
import { checkFollowRequestSent, checkifFollowing, sendFollowRequest, unFollowUser } from 'data/api/relationships'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { useModal } from 'data/context/modal-context'
import EditBioForm from '@forms/EditBioForm'
import { AvatarGroup } from '@mantine/core/lib/Avatar/AvatarGroup/AvatarGroup'
import FollowersFollowing from 'ui/sections/FollowersFollowing'
import EditProfileForm from '@forms/EditProfileForm'

export interface IProfileCardProps {
    profile: UserProfile,
    showFollowButton?: boolean
    [key: string]: any
}

const ProfileCard = ({ profile, showFollowButton = false }: IProfileCardProps) => {

    const [loading, setLoading] = useState<boolean>(true)
    const [followRequestSent, setFollowRequestSent] = useState<boolean>(false)
    const [following, setFollowing] = useState<boolean>(false)
    const { userProfile } = useUserProfile()
    const { openModal } = useModal()

    const { setError } = useAppContext();

    useEffect(() => {
        fetchData()
    }, [])

    function handleOnEditBioClick() {
        openModal({
            title: 'Edit Bio',
            content: <EditBioForm bio={profile.bio} />,
            size: 'lg'
        })

    }

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

    const handleUnfollowClick = async () => {
        try {
            setLoading(true)
            await unFollowUser(profile.id)
            setFollowing(false)
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    const handleFollowersFollowingClick = async () => {
        openModal({
            content: <FollowersFollowing />,            
        })
    }

    function handleEditProfileClick() {
        openModal({
            title:'Edit Profile',
            content: <EditProfileForm profile={profile}/>,            
        })
    }

    return (
        <Card shadow='md' p={0}>

            <div className="d-flex justify-content-center align-items-center pt-4">
                <Avatar src={profile.avatar} size='xl' radius='xl' />
            </div>

            <div className="text-center">
                <h5 className="h4 m-0 p-0 text-capitalize d-block">{profile.firstname} {profile.lastname}</h5>

                <Text fw={300} className='text-muted mb-2'>@{profile.username}</Text>

                <Divider />
                {
                    profile.bio ?
                        <p className="fs-6 my-3">{profile.bio}</p> :
                        <p className="fs-6 m-4 text-muted fst-italic"><span className='text-capitalize'>{profile.id === userProfile?.id ? 'You' : profile.firstname}</span> do not have any bio yet.</p>
                }
                {
                    (profile.id === userProfile?.id) &&
                    <Button compact variant='outline' mb='sm' leftIcon={<IconPencil size={12} />} size='xs' onClick={handleOnEditBioClick}>Edit bio</Button>}
                <Divider />
                <div className="row">
                    <div className="col-lg-6 text-center border-end py-3" role='button' onClick={handleFollowersFollowingClick}>
                        <p className="fs-5 text-muted fw-bold m-0 p-0">{profile.followersCount}</p>
                        <p className="fs-6 text-muted m-0 p-0">Followers</p>

                    </div>
                    <div className="col-lg-6 text-center py-3" role='button' onClick={handleFollowersFollowingClick}>
                        <p className="fs-5 text-muted fw-bold m-0 p-0" >{profile.followedCount}</p>
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
                                following ? <Button variant='outline' my='lg' leftIcon={<IconUserX size={15} />} loading={loading} color='yellow' onClick={handleUnfollowClick}>Unfollow</Button> :
                                    <Button variant='outline' my='lg' leftIcon={loading ? <Loader size={15} /> : <IconUserPlus size={15} />} onClick={handleFollowButtonClick}>Follow<span className='text-capitalize ms-1'>{profile.firstname}</span></Button>
                        }

                    </>
                }

                {
                    (profile.id === userProfile?.id) && <>
                        <Divider />
                        <Button variant='outline' my='sm' compact leftIcon={<IconUserExclamation size={15} />} onClick={handleEditProfileClick}>Edit Profile</Button>
                    </>
                }
            </div>
        </Card>
    )
}

export default ProfileCard