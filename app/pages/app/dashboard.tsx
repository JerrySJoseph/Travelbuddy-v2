import { useAuth } from 'data/hooks/useAuth'
import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import {app} from '../../firebase/init'
const Dashboard = () => {
  const { user ,logout} = useAuth();
  return (
    <div className="container">
      Welcome {user?.displayName}
      <div className="btn btn-sm btn-primary" onClick={logout}>Logout</div>
    </div>
  )
}

export default Dashboard