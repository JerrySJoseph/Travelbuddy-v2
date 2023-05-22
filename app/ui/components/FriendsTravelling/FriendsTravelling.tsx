/* eslint-disable @next/next/no-img-element */
import { Avatar, Button, Divider, Image, Skeleton, Text, ThemeIcon } from '@mantine/core'
import { IconCar, IconInfoCircle, IconUsers } from '@tabler/icons'
import { getFormattedDate } from 'Utils/dateutils'
import { useFriendsTravelling } from 'data/hooks/useFriendsTravelling'
import { TravelPlan } from 'data/models/user'

const FriendsTravelling = () => {

    const { travelPlans, loading } = useFriendsTravelling()



    const Item = ({ travelPlan }: { travelPlan?: TravelPlan | null }) => {
        if (!travelPlan)
            return <></>

        return (<div className="px-3 py-2">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">

                    <div className='ms-2 lh-1'>
                        <Text size='sm' fw='bold'>{travelPlan.group.name}</Text>
                        <Text size='xs' mb='xs'>(by {travelPlan.owner?.firstname})</Text>
                        <small className="text-muted">Destinations: {travelPlan.destinations.map(d => d.name).join(', ')}</small><br />
                        <small className="text-muted">Dates: {getFormattedDate(travelPlan.travellingDateRange.start)} - {getFormattedDate(travelPlan.travellingDateRange.end)}</small>
                        <Text size='xs' mt='xs' color='dimmed'>Group Members</Text>
                        {
                            travelPlan.group &&
                            <Avatar.Group spacing="xs" mr={7}>
                                {
                                    travelPlan.group.members.map(pr => <Avatar key={pr.id} src={pr.avatar} radius="xl" size='md' />)
                                }
                            </Avatar.Group>
                        }
                    </div>


                </div>
                <ThemeIcon>
                    <IconCar size={18} />
                </ThemeIcon>

            </div>
            <Divider my='sm' />

        </div>)
    }

    if (loading)
        return <div className="card p-4 rounded-4">
            <Skeleton radius='xl' mb='xs' height={20} width={'50%'} />
            <Skeleton radius='xl' mb='xs' height={20} width={'80%'} />
            <Skeleton radius='xl' mb='xs' height={20} width={'100%'} />
            <Skeleton radius='xl' mb='xs' height={20} width={'100%'} />
        </div>

  

    return (
        <div className="card p-0 rounded-4">
            <div className="d-flex align-items-center p-2">
                <IconUsers size={18} />
                <Text size='md' fw={500} ml='xs'>Travel plans for you</Text>
            </div>
            <Divider mb='md' />
            {
                travelPlans.length===0 &&
                <div className="text-center p-2">
                    <img src='/img/empty_friend_travelling.svg' alt='empty' width='50%'/>
                    <Text size='sm' fw='bold' mt='xs' color='dimmed'>No Travel plans yet</Text>
                    <Text size='xs'color='dimmed'>Seems like you have not created any travel plans yet</Text>
                </div>
            }
            {
                travelPlans.map(tp => <Item key={tp.id} travelPlan={tp} />)
            }
        </div>
    )
}

export default FriendsTravelling