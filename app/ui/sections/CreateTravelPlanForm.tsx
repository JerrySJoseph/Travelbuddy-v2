/* eslint-disable @next/next/no-img-element */
import {
    Autocomplete,
    Button,
    MultiSelect,
    PaperProps,
    Stepper,
    ThemeIcon,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as cities from '../../cities.json'
import { IconArrowLeft, IconArrowRight, IconCar, IconPhoto, IconPlus, IconUser, IconUsers } from '@tabler/icons';
import { User } from 'firebase/auth';
import { UserProfile } from 'data/models/user';
import { getAllUserProfiles } from 'data/api/profile';

export function CreateTravelPlanForm(props: PaperProps) {

    const [destinationsList, setDestinationsList] = useState<string[]>([])
    const [destinations, setDestinations] = useState<string[]>([])
    const [users,setUsers]=useState<UserProfile[]>([])
    const [friendsList, setFriendsList] = useState<string[]>(['Jarvis', 'Ultron', 'Some ither'])
    const [friends, setFriends] = useState<string[]>([])
    const [friendSearch,onFriendSearchChange]=useState('')

    const router = useRouter()

    useEffect(() => {

        async function fetchUserProfiles(){
            const _users=await getAllUserProfiles();
            setUsers(_users.docs.map(doc=>doc.data() as UserProfile))
            setFriendsList(_users.docs.map(doc=>`${doc.data().firstname} ${doc.data().lastname}`))
        }
    
       setDestinationsList(cities.map(c=>`${c.name} (${c.country})`))
       fetchUserProfiles();
    }, [])

    useEffect(() => {
        setFriendsList(users.filter(f=>f.username.includes(friendSearch)).map(f=>f.username))
    }, [friendSearch])

    const [active, setActive] = useState(0);
    const [highestStepVisited, setHighestStepVisited] = useState(active);

    const handleStepChange = (nextStep: number) => {
        const isOutOfBounds = nextStep > 3 || nextStep < 0;

        if (isOutOfBounds) {
            return;
        }

        setActive(nextStep);
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
    };

    // Allow the user to freely go back and forth between visited steps.
    const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
                            creatable
                            searchable
                            clearable
                            limit={10}
                            
                            onChange={setDestinations}

                            getCreateLabel={(query) => `+ Add ${query}`}
                            onCreate={(query) => {
                              const item = { value: query, label: query };
                              setDestinationsList((current) => [...current, query]);
                              return item;
                            }} />

                       
                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant='outline' leftIcon={<IconArrowLeft size='1rem' />} onClick={prevStep}>Back</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={destinations.length===0}>Next</Button>
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
                        <h3 className="h5 m-0 p-0">Invite Friends</h3>
                        <small className="text-muted">Do you have a travel group in mind? Invite all of your friends whom you wanna travel with.</small>
                    </div>
                    <form >
                        <MultiSelect
                            data={friendsList}
                            value={friends}
                            label="Your Travel Group"
                            placeholder="Add your friends"
                            searchable
                            searchValue={friendSearch}
                            onSearchChange={onFriendSearchChange}
                            limit={10}
                            nothingFound="No such user found"
                            onChange={setFriends} />

                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Button variant='outline' color='grey' onClick={nextStep}>Skip</Button>
                        <Button rightIcon={<IconArrowRight size='1rem' />} variant='outline' onClick={nextStep} disabled={friends.length===0}>Next</Button>
                    </div>
                </Stepper.Step>
                <Stepper.Step
                    label="Final step"
                    description="Get full access"
                    allowStepSelect={shouldAllowSelectStep(2)}
                >
                    Step 3 content: Get full access
                </Stepper.Step>

                <Stepper.Completed>
                    Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>




        </div>
    );
}
