import PostItem from '@components/PostItem/PostItem';
import { getAllPosts, getFeeds } from 'data/api/post';
import { Post } from 'data/models/user';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';


const Dashboard = () => {

  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    console.log(posts)
  }, [posts])

  async function fetchPosts() {
    setPosts(await getFeeds())
  }

  return (
    <Applayout >
      {
        posts.map(p=>(
          <PostItem key={p.id} post={p}/>
        ))
      }
    </Applayout>
  )
}

export default Dashboard