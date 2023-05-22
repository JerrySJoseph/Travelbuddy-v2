import { Avatar, Button, Divider, Text, ThemeIcon } from '@mantine/core'
import { IconCar, IconDots, IconDotsCircleHorizontal, IconGridDots, IconInfoCircle, IconUsers } from '@tabler/icons'
import { getFormattedDate } from 'Utils/dateutils'
import { capitalizeFirstLetter } from 'Utils/stringutils'
import { getFollowingsTravelPlan } from 'data/api/post'
import { useAppContext } from 'data/context/app-context'
import { Post, TravelPlan } from 'data/models/user'
import React, { useEffect, useState } from 'react'

const FriendsTravelling = () => {

    const [travellingPlanPost, setTravellingPlanPost] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(false);

    const { setError } = useAppContext();

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        console.log(travellingPlanPost)
    }, [travellingPlanPost])

    async function fetchData() {
        try {
            setLoading(true);
            setTravellingPlanPost(await getFollowingsTravelPlan(5));

        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false)
        }
    }


    const Item = ({ travelPlan }: { travelPlan?: TravelPlan | null }) => {
        if (!travelPlan)
            return <></>

        return (<div className="card p-2">
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">

                    <div className='ms-2 lh-1'>
                        <Text size='sm' fw='bold'>{travelPlan.group.name}</Text>
                        <small className="text-muted">Destinations: {travelPlan.destinations.map(d => d.name).join(', ')}</small><br />
                        <small className="text-muted">Dates: {getFormattedDate(travelPlan.travellingDateRange.start)} - {getFormattedDate(travelPlan.travellingDateRange.end)}</small>
                        {
                            travelPlan.group &&
                            <Avatar.Group spacing="xs" mr={7}>
                                {
                                    travelPlan.group.members.map(pr => <Avatar key={pr.id} src={pr.avatar} radius="xl" size='sm' />)
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
            <div className="d-flex">
                <Button compact fullWidth leftIcon={<IconInfoCircle size={15}/>}>View more</Button>
            </div>
        </div>)
    }

    return (
        <div className="card p-3 rounded-4">
            <div className="d-flex align-items-center">
                <IconUsers size={18} />
                <Text size='md' fw={500} ml='xs'>You friends are travelling</Text>
            </div>
            <Divider mb='md' />
            {
                travellingPlanPost.map(post => <Item key={post.id} travelPlan={post.travelPlan} />)
            }
        </div>
    )
}

export default FriendsTravelling