import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'
import ProfileCard from '@components/ProfileCard/ProfileCard'
import { useUserProfile } from 'data/hooks/useUserProfile'
import { Post } from 'data/models/user'


export interface IUserProfilePage {
    posts: Post[]
}

const MyProfilePage = ({ posts }: IUserProfilePage) => {
    const { userProfile } = useUserProfile()

    if (!userProfile)
        return <>NO User logged in</>

    return (
        <div className="row">
            <div className="col-lg-3">
                <ProfileCard profile={userProfile} showFollowButton={false} />
            </div>
            <div className="col-lg-6">
                <NewPostComponent className='mb-3'/>
                {
                    posts.map(pi => <PostItem key={pi.id} post={pi}/>)
                }
            </div>
            <div className="col-lg-3">

            </div>
        </div>
    )
}

export default MyProfilePage