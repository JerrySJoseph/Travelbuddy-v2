import { Card, Paper ,Image, Badge, Group, Text, Rating} from '@mantine/core'
import { Destination } from 'data/models/user'

export interface IDestinationProps{
    destination:Destination
}

const DestinationComponent = ({destination}:IDestinationProps) => {
  return (
    <Card shadow='sm' p='md' radius='lg' role='button'>
        <Card.Section>
        <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        />
      </Card.Section>
      <Rating defaultValue={2} size="sm" my='md' count={5} />
      <Group position="apart">
        <Text weight={500}>{destination.name}</Text>
        <Badge color="green" variant="light">
          {destination.city}
        </Badge>
      </Group>
      <p className="text-muted m-0 p-0">{destination.country}</p>
    </Card>
  )
}

export default DestinationComponent