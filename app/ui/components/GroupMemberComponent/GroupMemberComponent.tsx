import { Avatar, Paper } from '@mantine/core'
import { UserProfile } from 'data/models/user'
import React from 'react'

export interface IGroupMemberProps{
    member:UserProfile
}

const GroupMemberComponent = ({member}:IGroupMemberProps) => {
  return (
    <Paper shadow='sm' p='md' radius='xl'>
        <div className="d-flex align-items-center br-4">
            <Avatar src={member.avatar} radius='xl'/>
            <div className='ml-4'>
            {member.firstname} {member.lastname}
            </div>
        </div>
    </Paper>
  )
}

export default GroupMemberComponent