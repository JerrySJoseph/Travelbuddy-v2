import NewPostComponent from '@components/NewPostComponent/NewPostComponent'
import PostItem from '@components/PostItem/PostItem'
import { ScrollArea,Text } from '@mantine/core'
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
                    posts.length === 0 &&
                    <div className="card p-4 rounded-4">
                        <div className="text-center p-2">
                            <img src='/img/empty_posts.svg' alt='empty' width='50%' />
                            <Text size='sm' fw='bold' mt='xs' color='dimmed'>No Posts Yet</Text>
                            <Text size='xs' color='dimmed'>People you follow have not posted anything yet. Please follow more people to get feeds.</Text>
                        </div>
                    </div>
                }
        </ScrollArea>
    )
}

export default Feeds