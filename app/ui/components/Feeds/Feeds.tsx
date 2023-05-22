import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'
import { ScrollArea } from '@mantine/core'
import { useFeeds } from 'data/hooks/useFeeds'

const Feeds = () => {

   const {posts,count}=useFeeds();


    return (
        <ScrollArea h={'90vh'}>
            <NewPostComponent className='mb-3' />
            {
                posts.map(p => <PostItem post={p} key={p.id} />)
            }
            {
                posts.length<count &&
                <></>
            }
        </ScrollArea>
    )
}

export default Feeds