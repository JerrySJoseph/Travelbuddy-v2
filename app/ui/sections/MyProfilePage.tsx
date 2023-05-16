import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'
import ProfileCard from '@components/ProfileCard/ProfileCard'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Post } from 'data/models/user'
import Applayout from 'ui/Layout/AppLayout/Applayout'


export interface IUserProfilePage{
    posts:Post[]
}

const MyProfilePage = ({posts}:IUserProfilePage) => {
    const { userProfile } = useUserProfile()

    if(!userProfile)
        return <>NO User logged in</>
    
    return (
        <Applayout isFluid={false}>
            <div className="row">
                <div className="col-lg-3">
                    <ProfileCard profile={userProfile} showFollowButton={false} />
                </div>
                <div className="col-lg-6">
                    <NewPostComponent />
                    {
                        posts.map(pi=><PostItem key={pi.id} post={pi}/>)
                    }
                </div>
                <div className="col-lg-3">

                </div>
            </div>
        </Applayout>
    )
}

export default MyProfilePage