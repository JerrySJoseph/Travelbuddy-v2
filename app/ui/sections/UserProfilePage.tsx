import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import ProfileCard from '@components/ProfileCard/ProfileCard'
import { UserProfile } from 'data/models/user'
import React from 'react'
import Applayout from 'ui/Layout/AppLayout/Applayout'

export interface IUserProfilePage{
    profile:UserProfile
}

const UserProfilePage = ({profile}:IUserProfilePage) => {
  return (
    <Applayout isFluid={false}>
            <div className="row">
                <div className="col-lg-3">
                    <ProfileCard profile={profile} showFollowButton />
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


export default UserProfilePage