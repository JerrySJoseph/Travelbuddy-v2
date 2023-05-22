/* eslint-disable react-hooks/exhaustive-deps */
import NewPostComponent from '@components/NewPostComponent/NewPostComponent';
import ProfileCard from '@components/ProfileCard/ProfileCard';
import { LoadingOverlay, Skeleton } from '@mantine/core';
import { getUserProfileWithId } from 'data/api/profile';
import { useAppContext } from 'data/context/app-context';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { Post, UserProfile } from '../../../data/models/user';
import { useUserProfile } from 'data/hooks/useUserProfile';
import MyProfilePage from 'ui/sections/MyProfilePage';
import UserProfilePage from 'ui/sections/UserProfilePage';
import { deletePost, getAllPosts } from 'data/api/post';
import PostItem from '@components/PostItem/PostItem';


const ProfilePage = () => {

    const { id } = useRouter().query;
    const { setError } = useAppContext()
    const { userProfile } = useUserProfile()
    const [profile, setProfile] = useState<UserProfile>()
    const [myposts, setMyPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        if (id)
            fetchData(id as string)
    }, [id])

    const fetchData = async (id: string) => {
        try {
            setLoading(true)
            setProfile(await getUserProfileWithId(id))
            setMyPosts(await getAllPosts(id))
        } catch (error) {
            console.error(error)
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    async function handleOnDeleteClick(postId: string) {
        try {
            console.log('calling delete')
            setLoading(true)
            console.log('deleted', await deletePost(postId))
            userProfile && fetchData(userProfile?.id)
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    if (loading)
        return <Applayout>
            <div className="row">
                <div className="col-lg-3">
                    <Skeleton radius='xl' />
                </div>
                <div className="col-lg-6">

                </div>
                <div className="col-lg-3">

                </div>
            </div>
        </Applayout>

    if (!profile)
        return <>NO such user profile</>

    if (loading || !userProfile)
        return <LoadingOverlay visible/>

    return (<Applayout>
        <div className="row">
            <div className="col-lg-3">
                <ProfileCard profile={userProfile} showFollowButton={false} />
            </div>
            <div className="col-lg-6">
                {
                    userProfile && userProfile.id === id &&
                    <NewPostComponent className='mb-3' />
                }
                {
                    myposts.map(pi => <PostItem key={pi.id} post={pi} ondeleteClick={()=>{
                        handleOnDeleteClick(pi.id)
                    }} />)
                }
            </div>
            <div className="col-lg-3">

            </div>
        </div>
    </Applayout>
    )
}

export default ProfilePage