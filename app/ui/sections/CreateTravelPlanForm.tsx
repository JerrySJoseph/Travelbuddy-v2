/* eslint-disable @next/next/no-img-element */
import {
    Button,
    Group,
    MultiSelect,
    PaperProps,
    Stepper,
    Switch,
    TextInput,
    Textarea,
    ThemeIcon
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconAlertTriangle, IconArrowLeft, IconArrowRight, IconCalendar, IconCar, IconCheck, IconEye, IconEyeOff, IconHeart, IconSend, IconTools, IconUsers, IconWorld } from '@tabler/icons';
import { getAllUserProfiles, getUserProfileWithId, getUserProfileWithName } from 'data/api/profile';
import { useAuth } from 'data/hooks/useAuth';
import { Destination, TravelGroup, TravelPlan, TravelPlanOverride, UserProfile } from 'data/models/user';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import cities from '../../destinations.json';
import LoadingFragment from './Loading';
import { getDestinations } from 'data/api/destinations';
import { createNewTravelPlan } from 'data/api/travelplan';


interface IMultiSelectItem {
    label: string,
    value: string,
    object: Destination
}

export function CreateTravelPlanForm(props: PaperProps) {



    const [destinationsList, setDestinationsList] = useState<IMultiSelectItem[]>([])
    const [destinations, setDestinations] = useState<string[]>([])
    const [friendsList, setFriendsList] = useState<string[]>(['Jarvis', 'Ultron', 'Some ither'])
    const [friends, setFriends] = useState<string[]>([])
    const [friendSearch, onFriendSearchChange] = useState('')
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [travelGroupName, setTravelGroupName] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [dates, setDates] = useState<[Date | null, Date | null]>([new Date(new Date().getTime() + 86400000), new Date(new Date().getTime() + (5 * 86400000))]);
    const [loading, setLoading] = useState<boolean>(false)
    const { user, userProfile } = useAuth()
    const [error, setError] = useState<string>('')

    useEffect(() => {

        async function fetchData() {
            const _users = await getAllUserProfiles();
            const destinations = await getDestinations();
            setFriendsList(_users.docs.map(doc => `${doc.data().firstname} ${doc.data().lastname}`))
            setDestinationsList(destinations.map(d => {
                return {
                    label: `${d.name} - ${d.country}`,
                    value: `${d.name} - ${d.country})`,
                    object: d
                }
            }))
        }

        fetchData();
    }, [])




    const [active, setActive] = useState(0);
    const [highestStepVisited, setHighestStepVisited] = useState(active);

    // Allow the user to freely go back and forth between visited steps.
    const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

    const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    async function getFriendProfiles(friendnames: string[]) {
        const friendProfilePromise: Promise<UserProfile>[] = []

        friendnames.forEach(async (fr) => {
            const [firstname, lastname] = fr.split(' ')
            friendProfilePromise.push(getUserProfileWithName(firstname, lastname))
        })
        return Promise.all(friendProfilePromise)
    }

    function _getDestinations(destinationNames: string[]) {
        const dlist: Destination[] = []
        destinationNames.forEach((d) => {
            console.log(d, [...d.split(' - ')])
            const idx = destinationsList.findIndex(v => v.object.name === d.split(' - ')[0])
            if (idx > -1)
                dlist.push(destinationsList[idx].object)
        })
        return dlist;
    }

    async function handleCreateTravelPlan() {
        try {
            setLoading(true)
            nextStep()
            const friendProfiles: UserProfile[] = await getFriendProfiles(friends)
            const destinationObjects: Destination[] = _getDestinations(destinations)


            const travelGroup: TravelGroup = {
                id: uuid(),
                name: travelGroupName,
                createdBy: userProfile,
                members: friendProfiles,
                type: 'travel-group'
            }
            const travelPlan: TravelPlan = {
                id: uuid(),
                createdBy: userProfile,
                destinations: destinationObjects,
                group: travelGroup,
                isPrivate,
                travellingDateRange: {
                    start: dates[0]?.getTime() || 0,
                    end: dates[1]?.getTime() || 0,
                    flexibility: 5
                },
                summary,
                type: 'travel-plan'
            }
            await createNewTravelPlan(travelPlan)
            setLoading(false)
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setLoading(false)
        }
    }




    return (
        <div className="" {...props}>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                <Stepper.Step
                    icon={<IconCar size='1.5rem' />}
                    allowStepSelect={shouldAllowSelectStep(0)}
                >
                    <div className="text-center mb-4">
                        <ThemeIcon size='lg'>
                            <IconCar />
                        </ThemeIcon>
                        <h3 className="h5 m-0 p-0">Create a New Travel Plan</h3>
                        <small className="text-muted">Have an idea for your next trip? Find people with similar ideas and enjoy a trip together</small>
                    </div>
                    <form >
                        <MultiSelect
                            data={destinationsList}
                            value={destinations}
                            label="Choose your destinations"
                            placeholder="Select Destinations from list or add new"
                            searchable
                            clearable
                            limit={10}
                            dropdownPosition='flip'
                            onSearchChange={v => console.error}
                            onChange={setDestinations}
                        />
                        <Switch
                            onLabel={<IconEyeOff size="1rem" stroke={2.5} />}
                            offLabel={<IconWorld size="1rem" stroke={2.5} />} 
                            label={`Make this travel plan ${isPrivate?'public':'private'}`}
                            mt='md'
                            checked={isPrivate}
                            onChange={()=>setIsPrivate(!isPrivate)}/>
                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant='outline' leftIcon={<IconArrowLeft size='1rem' />} onClick={prevStep}>Back</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={destinations.length === 0}>Next</Button>
                    </div>
                </Stepper.Step>
                <Stepper.Step
                    icon={<IconUsers size='1.5rem' />}
                    allowStepSelect={shouldAllowSelectStep(1)}
                >
                    <div className="text-center mb-4">
                        <ThemeIcon size='lg'>
                            <IconUsers />
                        </ThemeIcon>
                        <h3 className="h5 m-0 p-0">Add Friends to your Travel Group</h3>
                        <small className="text-muted">Do you have a travel group in mind? Invite all of your friends whom you wanna travel with.</small>
                    </div>
                    <form >
                        <TextInput
                            label="Name of your group (optional)"
                            placeholder="Eg: Rockstar travellers"
                            value={travelGroupName}
                            onChange={e => setTravelGroupName(e.target.value)}
                        />
                        <MultiSelect
                            data={friendsList}
                            value={friends}
                            mt='sm'
                            label="Group Members"
                            placeholder="Start typing to search members..."
                            searchable
                            limit={10}
                            nothingFound="No such user found"
                            onChange={setFriends} />

                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant='outline' color='grey' onClick={nextStep}>Skip</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={friends.length === 0}>Next</Button>
                    </div>
                </Stepper.Step>
                <Stepper.Step
                    icon={<IconCalendar size='1.5rem' />}
                    allowStepSelect={shouldAllowSelectStep(2)}
                >
                    <div className="text-center mb-4">
                        <ThemeIcon size='lg'>
                            <IconCalendar />
                        </ThemeIcon>
                        <h3 className="h5 m-0 p-0">Choose tentative dates for your travel</h3>
                        <small className="text-muted">Select a date range in which you are most likely to travel. Other group members can view the dates and decide accordingly.</small>
                    </div>
                    <Group position="center">
                        <DatePicker type="range" value={dates} onChange={setDates} />
                    </Group>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant='outline' color='grey' onClick={nextStep}>Skip</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={friends.length === 0}>Next</Button>
                    </div>

                </Stepper.Step>
                <Stepper.Step
                    icon={<IconHeart size='1.5rem' />}
                    allowStepSelect={shouldAllowSelectStep(2)}
                >
                    <div className="text-center mb-4">
                        <ThemeIcon size='lg'>
                            <IconCalendar />
                        </ThemeIcon>
                        <h3 className="h5 m-0 p-0">Summary about the Trip</h3>
                        <small className="text-muted">Write an amazing summary about the trip you are planning to have. A good summary motivates your invited members to join you on this adventure.</small>
                    </div>
                    <Textarea
                        label="Summary (optional)"
                        placeholder="Eg: Our goal is to provide a well-planned itinerary that balances sightseeing, cultural experiences, and relaxation, ensuring a memorable and fulfilling vacation for all."
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />

                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <Button rightIcon={<IconSend size='1rem' />} variant='filled' onClick={handleCreateTravelPlan} disabled={friends.length === 0}>Create Travel Plan</Button>
                    </div>
                </Stepper.Step>

                <Stepper.Completed>
                    {
                        (!loading && error) &&
                        <div className="text-center mb-4">
                            <ThemeIcon size='lg' color='red'>
                                <IconAlertTriangle />
                            </ThemeIcon>
                            <h3 className="h5 m-0 p-0">Error Occured</h3>
                            <small className="text-muted">We were not able to create this travel plan for you. Error Help: {error}</small>
                        </div>
                    }
                    {
                        (!loading && !error) &&
                        <div className="text-center mb-4">
                            <ThemeIcon size='lg'>
                                <IconCheck />
                            </ThemeIcon>
                            <h3 className="h5 m-0 p-0">Travel Plan Created</h3>
                            <small className="text-muted">We have created this travel plan for you. Enjoy your trip</small>
                        </div>
                    }
                    {
                        (loading) &&
                        <div className="text-center mb-4">
                            <ThemeIcon size='lg'>
                                <IconTools size='1.5rem' />
                            </ThemeIcon>
                            <h3 className="h5 m-0 p-0">Please wait!</h3>
                            <small className="text-muted">Give us a moment to set things up. Please wait while we create your Travel plan</small>
                        </div>
                    }

                </Stepper.Completed>
            </Stepper>




        </div>
    );
}
