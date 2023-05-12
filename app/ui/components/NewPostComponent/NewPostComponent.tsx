import { Avatar, Button, Textarea } from '@mantine/core'
import { IconCamera, IconCaravan, IconPlus, IconSend, IconVideo } from '@tabler/icons'
import { useAuth } from 'data/hooks/useAuth'
import React from 'react'

const NewPostComponent = () => {
    const {userProfile}=useAuth()
    return (
        <div className="card p-3 rounded-4">
            <div className="d-flex">
                <Avatar src={userProfile?.avatar} size='lg' radius='xl' mr='md'/>
                <div className="w-100">
                <Textarea size='md' className='w-100' mb='xs' radius='lg' placeholder={`What's happening?`}/>
                <Button variant='light' leftIcon={<IconCaravan size={18}/>} radius='xl' color='red'>Add Travel Plan</Button>
                <Button variant='light' leftIcon={<IconCamera size={18}/>} radius='xl'>Add Image</Button>
                <Button variant='filled' leftIcon={<IconSend size={18}/>} radius='xl' className='float-end'>POST</Button>
            </div>
            </div>
        </div>
    )
}

export default NewPostComponent