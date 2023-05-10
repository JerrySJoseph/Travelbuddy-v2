import DestinationComponent from '@components/DestinationComponent/DestinationComponent';
import GroupMemberComponent from '@components/GroupMemberComponent/GroupMemberComponent';
import { Alert, Avatar, Button, Divider, Modal, Paper, Skeleton, ThemeIcon, Title, useMantineTheme } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconPlaneArrival, IconPlaneDeparture, IconX } from '@tabler/icons';
import { acceptOrRejectTravelPlanInvite, getTravelPlan } from 'data/api/travelplan';
import { useAppContext } from 'data/context/app-context';
import { useAuth } from 'data/hooks/useAuth';
import { useTravelPlanInvites } from 'data/hooks/useTravelPlanInvites';
import { TravelPlan, TravelPlanInvite } from 'data/models/user';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { CreateTravelPlanForm } from 'ui/sections/CreateTravelPlanForm';


const Dashboard = () => {

    const { setError } = useAppContext()
    const [recievedInvite, setRecievedInvite] = useState<TravelPlanInvite>()
    const [travelPlan, setTravelPlan] = useState<TravelPlan>()

    const [loading, setLoading] = useState<boolean>(false)
    const theme = useMantineTheme()
    const [open, setOpen] = useState<boolean>(false)

    const { id } = useRouter().query

    const { invites } = useTravelPlanInvites()

    //if the user has recieved invite for this travel plan, show accept or reject options
    useEffect(() => {
        async function fetchdata() {
            try {
                setLoading(true)
                const recInv = invites.find(inv => inv.travelPlan.id === id)
                setRecievedInvite(recInv)
                setTravelPlan(await getTravelPlan(id as string))
                console.log('rec inv', recInv)
            } catch (error) {
                setError(error as Error)
            } finally {
                setLoading(false)
            }
        }
        fetchdata()
    }, [id, invites])


    function getFormattedDate(mils: number) {
        const date = new Date(mils)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    async function handleAcceptClick() {
      
        try {
            setLoading(true)
            if (recievedInvite)
                await acceptOrRejectTravelPlanInvite({ ...recievedInvite, status: 'ACCEPTED' })
            
        } catch (error) {
            setError(error as Error)
        } finally{
            setLoading(false)
        }
    }
    async function handleRejectClick() {
        try {
            setLoading(true)
            if (recievedInvite)
                await acceptOrRejectTravelPlanInvite({ ...recievedInvite, status: 'REJECTED' })
        } catch (error) {
            setError(error as Error)
        }finally{
            setLoading(false)
        }
    }

    const InviteComponent = ({invite}:{invite:TravelPlanInvite}) => {
        
        if (!invite)
            return <></>
        else if (invite.status === 'PENDING') {
            return <Alert icon={<IconAlertCircle size="1rem" />} title={`${invite.owner.firstname} Invited you for this trip`} color='green'>
                You can choose to accept or reject this invitation. Your response will be sent to {travelPlan?.createdBy?.firstname}.
                <div className="d-dlex mt-3">
                    <Button mr='md' leftIcon={<IconCheck size='1rem' />} onClick={handleAcceptClick}>Accept</Button>
                    <Button color='red' leftIcon={<IconX size='1rem' />} onClick={handleRejectClick}>Reject</Button>
                </div>
            </Alert>
        }
        else {
            return (<Alert icon={<IconAlertCircle size="1rem" />} title={`${invite.owner.firstname} invitation ${invite.status==='ACCEPTED'?'accepted':'rejected'}`} color={`${invite.status==='ACCEPTED'?'green':'red'}`}>
            You have rejected the invitation for this trip. Your response has been sent to {travelPlan?.createdBy?.firstname}.
            
        </Alert>)
        }
    }

    if (loading) {
        return <Applayout>
            <div className="row">
                <div className="col-lg-12 d-flex justify-content-between">
                    <Skeleton height={16} width='20%' radius="xl" />
                    <Skeleton height={10} width='40%' radius="xl" />
                </div>
                
                <Modal opened={open} onClose={() => { setOpen(false) }} centered size='xl' style={{ 'overflow': 'hidden' }}>
                    <CreateTravelPlanForm />
                </Modal>
            </div>
        </Applayout>
    }
    if (!travelPlan) {
        return <>NOT FOUND</>
    }



    return (
        <Applayout>
            <div className="row">
                <div className="col-lg-8" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="row">
                        <div className="col-12 m-0 p-0">
                            <div className="d-flex">
                                <Avatar src={travelPlan?.createdBy?.avatar} radius='xl' mr='sm' />
                                <Title order={3} color={theme.colors.primarycolor[0]}>{travelPlan?.createdBy?.firstname}{"'"}s Travel Plan</Title>
                                <Divider my='md' />
                            </div>
                        </div>
                        <Divider />
                        <div className="col-12 mt-4 m-0 p-0 my-4">
                            <Title order={3} color={theme.colors.primarycolor[0]}>Summary</Title>
                            <Paper shadow='sm' p='md' radius='lg'>
                                <p className="">{travelPlan?.summary}</p>
                            </Paper>

                        </div>
                        <Divider />
                        <div className="col-12 mt-4 m-0 p-0 my-4">
                            <div className="row g-2">
                                <Title order={3} color={theme.colors.primarycolor[0]}>Destinations</Title>
                                {travelPlan?.destinations.map(d => (
                                    <div className="col-lg-3" key={d.id}>
                                        <DestinationComponent destination={d} />
                                    </div>
                                ))}
                            </div>

                        </div>
                        <Divider />
                        <div className="col-12 mt-4 m-0 p-0 my-4 row">
                            <Title order={3} color={theme.colors.primarycolor[0]}>Tentative dates</Title>
                            <div className="col-lg-6">
                                <div className="d-flex">
                                    <Paper shadow='md' p='md' radius='lg' className='d-flex'>
                                        <ThemeIcon>
                                            <IconPlaneDeparture size='1rem' />
                                        </ThemeIcon>
                                    </Paper>
                                    <Paper shadow='md' p='md' radius='lg'>
                                        <p className="m-0 p-0">Travelling Date: <strong>{getFormattedDate(travelPlan?.travellingDateRange.start)}</strong></p>
                                    </Paper>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="d-flex">
                                    <Paper shadow='md' p='md' radius='lg' className='d-flex'>
                                        <ThemeIcon>
                                            <IconPlaneArrival size='1rem' />
                                        </ThemeIcon>
                                    </Paper>
                                    <Paper shadow='md' p='md' radius='lg'>
                                        <p className="m-0 p-0">Returning Date: <strong>{getFormattedDate(travelPlan?.travellingDateRange.end)}</strong></p>
                                    </Paper>
                                </div>
                            </div>
                        </div>
                        <Divider />
                        <div className="col-12 row g-2 m-0 p-0 my-4">
                            <Title order={3} color={theme.colors.primarycolor[0]}>Members ({travelPlan?.group.name})</Title>
                            {travelPlan?.group.members.map(d => (
                                <div key={d.id} className='col-lg-3'>
                                    <GroupMemberComponent member={d} />
                                </div>
                            ))}
                        </div>

                       
                    </div>
                </div>
                <div className="col-lg-4">
                    <Title order={3} color={theme.colors.primarycolor[0]}>Invitations</Title>
                    <Divider my='md' />
                    {recievedInvite && <InviteComponent invite={recievedInvite} />}

                </div>
            </div>
        </Applayout>
    )
}

export default Dashboard