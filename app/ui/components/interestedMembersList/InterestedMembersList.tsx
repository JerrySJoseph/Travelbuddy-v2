import { Group, Avatar, Button, Text } from '@mantine/core';
import { addToGroup } from 'data/api/post';
import { unFollowUser } from 'data/api/relationships';
import { useAppContext } from 'data/context/app-context';
import { useModal } from 'data/context/modal-context';
import { useInterestedMembers } from 'data/hooks/useInterestedMembers'
import { useUserProfile } from 'data/hooks/useUserProfile';
import { ShortProfile } from 'data/models/user';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

interface InterestedMembersListProps {
    postId: string
}

const InterestedMembersList = ({ postId }: InterestedMembersListProps) => {
    const { users } = useInterestedMembers(postId);

    useEffect(() => {
        console.log(users)
    }, [users])

    const [loading, setLoading] = useState<boolean>(false);
    const { setError } = useAppContext();
    const { userProfile } = useUserProfile()

    async function handleAddToGroup(user: ShortProfile) {
        try {
            setLoading(true)
            await addToGroup(postId, user)
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {
                users.map(u => <ListItem key={u.id} loading={loading} profile={u} onAddToGroupClick={() => {
                    handleAddToGroup(u)
                }} />)
            }
        </div>
    )
}


interface ListItemProps {
    profile: ShortProfile,
    loading:boolean,
    onAddToGroupClick: () => any
}
const ListItem = ({ profile, onAddToGroupClick ,loading}: ListItemProps) => {
    const { push } = useRouter();
    const { closeModal } = useModal();

    return (
        <div className="pb-2" role='button' >
            <div className="d-flex justify-content-between align-items-center">
                <Group noWrap onClick={() => {
                    push('/app/profile/' + profile.id)
                    closeModal()
                }}>
                    <Avatar src={profile.avatar} radius='xl' />
                    <div>
                        <Text className='text-capitalize' m={0}>{profile.firstname} {profile.lastname}</Text>
                        <Text size="xs" color="dimmed">
                            @{profile.username}
                        </Text>
                    </div>
                </Group>
                <Button compact loading={loading} onClick={onAddToGroupClick}>Add to group</Button>

            </div>
        </div>
    )
}

export default InterestedMembersList