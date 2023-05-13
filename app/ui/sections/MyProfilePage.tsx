import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import ProfileCard from '@components/ProfileCard/ProfileCard'
import { useUserProfile } from 'data/hooks/useUserProfile'
import Applayout from 'ui/Layout/AppLayout/Applayout'

const MyProfilePage = () => {
    const { userProfile } = useUserProfile()
    
    return (
        <Applayout isFluid={false}>
            <div className="row">
                <div className="col-lg-3">
                    <ProfileCard profile={userProfile} showFollowButton={false} />
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

export default MyProfilePage