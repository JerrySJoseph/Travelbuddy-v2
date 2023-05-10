import { Card, Paper, Image, Badge, Group, Text, Rating, Avatar } from '@mantine/core'
import { TravelPlan } from 'data/models/user'

export interface IDestinationProps {
    travelPlan: TravelPlan
}

const TravelPlanComponent = ({ travelPlan }: IDestinationProps) => {
    return (
        <Card shadow='sm' p='md' radius='lg' role='button'>
            <Card.Section>
                <Image
                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={160}
                    alt="Norway"
                />
            </Card.Section>

            <Group position="apart">


            </Group>
            <div className="">
                <Text weight={500}>{travelPlan.group.name} Travel Plan</Text>
                <small className="blockquote-footer">{travelPlan.createdBy?.firstname}</small>
            </div>
            <small className="text-muted">Members Joined</small>
            <Avatar.Group spacing="sm">
                {travelPlan.group.members.slice(0,5).map(m=>(<Avatar key={m.id} src={m.avatar} radius="xl" />))}
                {travelPlan.group.members.length>5 && <Avatar radius="xl">+5</Avatar>}
            </Avatar.Group>
        </Card>
    )
}

export default TravelPlanComponent