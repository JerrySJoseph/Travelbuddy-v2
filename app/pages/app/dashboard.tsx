import { Button, Modal } from '@mantine/core';
import { useAuth } from 'data/hooks/useAuth'
import { getAuth, signOut } from 'firebase/auth'
import React, { useState } from 'react'
import Applayout from 'ui/Layout/AppLayout/Applayout';
import { CreateTravelPlanForm } from 'ui/sections/CreateTravelPlanForm';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Applayout>
      <div className="row">
        <div className="col-lg-12 d-flex justify-content-between">
          <h3 className="h3">Travel Plans</h3>
          <Button variant='outline' onClick={()=>{setOpen(!open)}}>Crate new Travel plan</Button>
        </div>
        <Modal opened={open} onClose={()=>{setOpen(false)}} centered size='xl' style={{'overflow':'hidden'}}>
        <CreateTravelPlanForm/>
      </Modal>
      </div>
    </Applayout>
  )
}

export default Dashboard