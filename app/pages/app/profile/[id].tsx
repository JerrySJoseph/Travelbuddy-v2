/* eslint-disable react-hooks/exhaustive-deps */
import ProfileCard from '@components/ProfileCard/ProfileCard';
import { Skeleton } from '@mantine/core';
import { getUserProfileWithId } from 'data/api/profile';
import { useAppContext } from 'data/context/app-context';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { UserProfile } from '../../../data/models/user';
import NewPostComponent from '@components/NewPostComponent/NewPostComponent';
import { useAuth } from 'data/hooks/useAuth';


const ProfilePage = () => {

    const { id } = useRouter().query;
    const { setError } = useAppContext()
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile>()
    const [loading, setLoading] = useState<boolean>(false)


    useEffect(() => {
        if (id)
            fetchData(id as string)
    }, [id])

    const fetchData = async (id: string) => {
        try {
            setLoading(true)
            setProfile(await getUserProfileWithId(id))
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    if (loading)
        return <Applayout isFluid>
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

    return (
        <Applayout isFluid={false}>
            <div className="row">
                <div className="col-lg-3">
                    <ProfileCard profile={profile} showFollowButton={user?.uid !== id || false} />
                </div>
                <div className="col-lg-6">
                    <NewPostComponent />
                </div>
                <div className="col-lg-3">

                </div>
            </div>
        </Applayout>
    )
}

export default ProfilePage