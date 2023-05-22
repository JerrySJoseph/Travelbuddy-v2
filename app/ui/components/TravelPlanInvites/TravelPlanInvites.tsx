import { Avatar, Button, Divider, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import { acceptTravelPlanInvite, rejectTravelPlanInvite } from 'data/api/post';
import { acceptFollowRequest, rejectFollowRequest } from 'data/api/relationships';
import { useAppContext } from 'data/context/app-context';
import { useTravelPlanInvites } from 'data/hooks/useTravelPlanInvites'
import { TravelPlanInvite } from 'data/models/user';
import React, { useState } from 'react'

const TravelPlanInvites = () => {
    const { invites } = useTravelPlanInvites();

    const Item = ({ invite }: { invite: TravelPlanInvite }) => {
        return (
            <div className="card p-3 rounded-4 mb-4">
                <div className="d-flex align-items-center">
                    <Avatar src={invite.owner.avatar} radius='xl' size='md' />
                    <div className="ms-2">
                        <Text fw='bold'>Join {invite.travelPlan.group.name}?</Text>
                        <Text size='xs'>{invite.owner.firstname} is inviting you to join {invite.travelPlan.group.name} on their next journey.</Text>
                    </div>
                </div>
                <Divider my='xs' />
                <div className="d-flex">
                    <InviteAcceptRejectButton invite={invite} variant='accept' />
                    <InviteAcceptRejectButton invite={invite} variant='reject' />
                </div>
            </div>
        )
    }
    return (
        <div className=''>
            {
                invites.map(i => <Item key={i.id} invite={i} />)
            }
        </div>
    )
}


interface IRequestAcceptRejectButtonProps {
    invite: TravelPlanInvite,
    variant: 'accept' | 'reject'
}

const InviteAcceptRejectButton = ({ invite, variant = 'accept' }: IRequestAcceptRejectButtonProps) => {
    const { setError } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);

    async function handleAcceptOrReject() {
        const fn = variant === 'accept' ? acceptTravelPlanInvite : rejectTravelPlanInvite
        await fn(invite)
        try {
            setLoading(true)

        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false);
        }
    }

    return <Button compact variant="outline" mr='md' onClick={handleAcceptOrReject}
        loading={loading} leftIcon={variant === 'reject' ? <IconX size={15} /> : <IconCheck size={15} />} color={variant === 'reject' ? 'red' : 'green'}>{variant === 'accept' ? 'Accept' : 'Reject'}{loading && 'ing'}</Button>
}

export default TravelPlanInvites