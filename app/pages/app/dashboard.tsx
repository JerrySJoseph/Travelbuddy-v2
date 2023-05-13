import TravelPlanComponent from '@components/TravelPlanComponent/TravelPlanComponents';
import { Button, Modal, ThemeIcon, Title, useMantineTheme } from '@mantine/core';
import { IconLocation, IconPlaneDeparture, IconUserCircle, IconUsers } from '@tabler/icons';
import { getPublicTravelPlans } from 'data/api/travelplan';
import { TravelPlan } from 'data/models/user';
import { useEffect, useState } from 'react';
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { CreateTravelPlanForm } from 'ui/sections/CreateTravelPlanForm';


const Dashboard = () => {

  const [open, setOpen] = useState<boolean>(false)
  const theme = useMantineTheme()
  const [travelPlans,setTravelPlans]=useState<TravelPlan[]>([])


  useEffect(()=>{
    fetchData()
  },[])


  async function fetchData() {
    setTravelPlans(await getPublicTravelPlans())
  }

  return (
    <Applayout>
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <ThemeIcon size='lg' mr='sm'>
              <IconLocation size='1rem' />
            </ThemeIcon>
            <div>
              <Title order={4} color={theme.colors.primarycolor[0]} className='m-0 p-0'>Popular Destinations</Title>
              <small className="text-muted m-0 p-0">A list of travel plans your friends have posted</small>
            </div>
          </div>
          <Button variant='outline' onClick={() => { setOpen(!open) }}>Crate new Travel plan</Button>
        </div>
        <div className="col-lg-12 row">
          
        </div>

        <div className="col-lg-12 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <ThemeIcon size='lg' mr='sm'>
              <IconPlaneDeparture size='1rem' />
            </ThemeIcon>
            <div>
              <Title order={4} color={theme.colors.primarycolor[0]} className='m-0 p-0'>Popular Travel Plans</Title>
              <small className="text-muted m-0 p-0">A list of travel plans your friends have posted</small>
            </div>
          </div>
          <Button variant='outline' onClick={() => { setOpen(!open) }}>Crate new Travel plan</Button>
        </div>
        <div className="col-lg-12 row">
          {
            travelPlans.map(tp=>(
              <div className="col-lg-2" key={tp.id}>
                <TravelPlanComponent travelPlan={tp}/>
              </div>
            ))
          }
        </div>

        <div className="col-lg-12 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <ThemeIcon size='lg' mr='sm'>
              <IconUsers size='1rem' />
            </ThemeIcon>
            <div>
              <Title order={4} color={theme.colors.primarycolor[0]} className='m-0 p-0'>Popular Groups</Title>
              <small className="text-muted m-0 p-0">A list of travel plans your friends have posted</small>
            </div>
          </div>
          <Button variant='outline' onClick={() => { setOpen(!open) }}>Crate new Travel plan</Button>
        </div>

        <div className="col-lg-12 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <ThemeIcon size='lg' mr='sm'>
              <IconUserCircle size='1rem' />
            </ThemeIcon>
            <div>
              <Title order={4} color={theme.colors.primarycolor[0]} className='m-0 p-0'>Popular People</Title>
              <small className="text-muted m-0 p-0">A list of travel plans your friends have posted</small>
            </div>
          </div>
          <Button variant='outline' onClick={() => { setOpen(!open) }}>Crate new Travel plan</Button>
        </div>




        <Modal opened={open} onClose={() => { setOpen(false) }} centered size='lg' style={{ 'overflow': 'hidden' }}>
          <CreateTravelPlanForm />
        </Modal>
      </div>

    </Applayout>
  )
}

export default Dashboard