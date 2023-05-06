import { useAuth } from 'data/hooks/useAuth'
import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import Applayout from 'ui/Layout/AppLayout/Applayout';


const Dashboard = () => {
  const { user ,logout} = useAuth();
  return (
    <Applayout>
      Dashboard 
    </Applayout>
  )
}

export default Dashboard