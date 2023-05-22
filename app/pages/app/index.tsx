import NewPostComponent from '@components/NewPostComponent/NewPostComponent';
import PostItem from '@components/PostItem/PostItem';
import ProfileCard from '@components/ProfileCard/ProfileCard';
import { profile } from 'console';
import { getAllPosts, getFeeds } from 'data/api/post';
import { useUserProfile } from 'data/hooks/useUserProfile';
import { Post } from 'data/models/user';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';
import Feeds from 'ui/components/Feeds/Feeds';


const Dashboard = () => {

  const {userProfile}=useUserProfile()
  
  return (
    <Applayout>
      <div className="row">
        <div className="col-lg-3">
          {userProfile && <ProfileCard profile={userProfile}/>}
        </div>
        <div className="col-lg-6">
          <Feeds/>
        </div>
        <div className="col-lg-3">

        </div>
      </div>
    </Applayout>
  )
}

export default Dashboard