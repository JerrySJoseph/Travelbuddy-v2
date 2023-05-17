import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'

import ProfileCard from '@components/ProfileCard/ProfileCard'
import { Post, UserProfile } from 'data/models/user'
import React from 'react'
import Applayout from 'ui/Layout/AppLayout/Applayout'

export interface IUserProfilePage {
    profile: UserProfile,
    posts: Post[]
}

const UserProfilePage = ({ profile ,posts}: IUserProfilePage) => {
    return (
        <div className="row">
            <div className="col-lg-3">
                <ProfileCard profile={profile} showFollowButton />
            </div>
            <div className="col-lg-6">
            {
                    posts.map(pi => <PostItem key={pi.id} post={pi} showEditMenu />)
                }
            </div>
            <div className="col-lg-3">

            </div>
        </div>
    )
}


export default UserProfilePage