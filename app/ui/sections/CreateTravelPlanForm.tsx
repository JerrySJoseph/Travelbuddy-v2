/* eslint-disable @next/next/no-img-element */
import FollowersSelect from '@components/FollowersSelect/FollowersSelect';
import {
    Button,
    Group,
    MultiSelect,
    SelectItemProps,
    Stepper,
    Switch,
    TextInput,
    Textarea,
    ThemeIcon
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight, IconCalendar, IconCar, IconEyeOff, IconHeart, IconSend, IconUsers, IconWorld } from '@tabler/icons';
import { getDestinations } from 'data/api/destinations';
import { getShortProfile } from 'data/api/profile';
import { getFollowers } from 'data/api/relationships';
import { useUserProfile } from 'data/hooks/useUserProfile';
import { Destination, ShortProfile, TravelGroup, TravelPlan, getShortProfileFromUserProfile } from 'data/models/user';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';


interface IMultiSelectItem {
    label: string,
    value: string,
    object: Destination
}

interface CreateTravelPlanProps {
    onSave: (travelPlan: TravelPlan) => any
}
export function CreateTravelPlanForm({ onSave = () => { } }: CreateTravelPlanProps) {

    const [destinationsList, setDestinationsList] = useState<IMultiSelectItem[]>([])
    const [destinations, setDestinations] = useState<string[]>([])
    const [friendsList, setFriendsList] = useState<SelectItemProps[]>([])
    const [friends, setFriends] = useState<string[]>([])
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [travelGroupName, setTravelGroupName] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [dates, setDates] = useState<[Date | null, Date | null]>([new Date(new Date().getTime() + 86400000), new Date(new Date().getTime() + (5 * 86400000))]);
    const [loading, setLoading] = useState<boolean>(false)
    const { userProfile } = useUserProfile()
    const [error, setError] = useState<string>('')


    const [inviteMembers, setInviteMembers] = useState<string[]>([])

    useEffect(() => {

        async function fetchData() {
            const _users = await getFollowers();
            const destinations = await getDestinations();
            setFriendsList(_users.map(doc => ({
                label: `${doc.firstname} ${doc.lastname}`,
                value: doc.id
            })))
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
        const friendProfilePromise: Promise<ShortProfile>[] = []

        friendnames.forEach(async (fr) => {
            const [firstname, lastname] = fr.split(' ')
            friendProfilePromise.push(getShortProfile(fr))
        })
        return Promise.all(friendProfilePromise)
    }

    function _getDestinations(destinationNames: string[]) {
        const dlist: Destination[] = []
        destinationNames.forEach((d) => {
            const idx = destinationsList.findIndex(v => v.object.name === d.split(' - ')[0])
            if (idx > -1)
                dlist.push(destinationsList[idx].object)
        })
        return dlist;
    }

    async function handleCreateTravelPlan() {
        try {

            if (!userProfile) return
            setLoading(true)
            const friendProfiles: ShortProfile[] = await getFriendProfiles(friends)
            const destinationObjects: Destination[] = _getDestinations(destinations)

            const travelGroup: TravelGroup = {
                id: uuid(),
                name: travelGroupName,
                createdBy: getShortProfileFromUserProfile(userProfile),
                members: [
                    getShortProfileFromUserProfile(userProfile)
                ],
                type: 'travel-group'
            }
            const travelPlan: TravelPlan = {
                id: uuid(),
                createdBy: userProfile.id,
                destinations: destinationObjects,
                group: travelGroup,
                isPrivate,
                inviteMembers,
                travellingDateRange: {
                    start: dates[0]?.getTime() || 0,
                    end: dates[1]?.getTime() || 0,
                    flexibility: 5
                },
                summary,
                type: 'travel-plan'
            }
            onSave(travelPlan)
            setLoading(false)
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setLoading(false)
        }
    }




    return (
        <div className="">
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
                        <small className="text-muted">Have an idea for your next trip? Find people with similar ideas and enjoy a trip together!</small>
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
                            label={`Make this travel plan ${isPrivate ? 'public' : 'private'}`}
                            mt='md'
                            checked={isPrivate}
                            onChange={() => setIsPrivate(!isPrivate)} />
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
                        <small className="text-muted">Do you have a travel group in mind? Invite all of your friends with whom you would like to travel!</small>
                    </div>
                    <form >
                        <TextInput
                            label="Name of your group"
                            placeholder="Eg: Rockstar travellers"
                            value={travelGroupName}
                            onChange={e => setTravelGroupName(e.target.value)}
                        />
                        <FollowersSelect onChange={setInviteMembers} />

                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant='outline' leftIcon={<IconArrowLeft size='1rem' />} onClick={prevStep}>Back</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={inviteMembers.length === 0 || travelGroupName.length === 0}>Next</Button>
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
                    <Button variant='outline' leftIcon={<IconArrowLeft size='1rem' />} onClick={prevStep}>Back</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={dates[0] === null || dates[1] === null}>Next</Button>
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
                        <small className="text-muted">Write a short summary about the exciting trip you are planning to have. A good summary motivates your invited members to join you on this adventure.</small>
                    </div>
                    <Textarea
                        label="Summary (optional)"
                        placeholder="Eg: Our goal is to provide a well-planned itinerary that balances sightseeing, cultural experiences, and relaxation, ensuring a memorable and fulfilling vacation for all."
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />

                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <Button rightIcon={<IconSend size='1rem' />} variant='filled' onClick={handleCreateTravelPlan} disabled={!summary}>Add Travel Plan</Button>
                    </div>
                </Stepper.Step>

            </Stepper>




        </div>
    );
}
