import { Drawer, Group, Button ,DrawerProps} from '@mantine/core'
import React from 'react'


type MessageGroupProps={
    opened:boolean,
    toggleOpen:()=>any
}
const MessageGroup = ({opened,toggleOpen}:MessageGroupProps) => {
    return (

        <Drawer
            opened={opened}
            onClose={toggleOpen}
            title="Message Groups"
            padding="xl"
            size="xl"
            position='right'
        >
            {/* Drawer content */}
        </Drawer>


    )
}

export default MessageGroup