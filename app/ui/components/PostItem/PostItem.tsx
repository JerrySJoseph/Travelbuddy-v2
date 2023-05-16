import { Avatar, Divider, Image, Text } from '@mantine/core'
import { Post } from 'data/models/user'
import React from 'react'
import { Carousel } from '@mantine/carousel'

export interface IPostItemProps {
    post: Post
}

const PostItem = ({ post }: IPostItemProps) => {
    return (
        <div className="card p-0 rounded-4 mt-3">
            <div className="d-flex p-2">
                <Avatar src={post.owner.avatar} />
                <div className='ms-2'>
                    <Text tt='capitalize' lh={1}>{post.owner.firstname} {post.owner.lastname}</Text>
                    <Text color='dimmed' size='xs'>@{post.owner.username}</Text>
                </div>
            </div>
            <Divider />
            <div className="d-flex p-2">
                <Carousel  mx="auto" withIndicators>
                    {
                        post.medias&& post.medias.map(item=>(
                            <Carousel.Slide key={item.mediaUrl}>
                                <Image src={item.mediaUrl} fit='contain' height={400} alt='x'/>
                            </Carousel.Slide>
                        ))
                    }
                </Carousel>
                
            </div>
        </div>
    )
}

export default PostItem