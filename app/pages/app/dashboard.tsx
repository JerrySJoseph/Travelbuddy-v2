import { Button, Modal, Notification as NotificationComponent, ThemeIcon, Title, useMantineTheme } from '@mantine/core';
import { IconLocation, IconPlaneDeparture, IconUser } from '@tabler/icons';
import { useAuth } from 'data/hooks/useAuth'
import { useNotifications } from 'data/hooks/useNotifications';
import { Notification } from 'data/models/user';
import { getAuth, signOut } from 'firebase/auth'
import React, { useState } from 'react'
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { CreateTravelPlanForm } from 'ui/sections/CreateTravelPlanForm';


const Dashboard = () => {

  const [open, setOpen] = useState<boolean>(false)
  const theme = useMantineTheme()

  return (
    <Applayout>
      <div className="row">
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

        <div className="col-lg-12 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <ThemeIcon size='lg' mr='sm'>
              <IconUser size='1rem' />
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