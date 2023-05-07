/* eslint-disable @next/next/no-img-element */
import { Autocomplete, Button, Menu, useMantineTheme, Text } from "@mantine/core"
import { IconBell, IconBook, IconCalendar, IconCar, IconChevronDown, IconNotification, IconPackage, IconPower, IconSearch, IconSquareCheck, IconUser, IconUsers } from "@tabler/icons"
import { useAuth } from "data/hooks/useAuth"
import { Notification } from "data/models/user"
import {getDatabase,onValue,ref} from 'firebase/database'
import { useEffect, useState } from "react"

const TopNavbar = () => {

    const { user } = useAuth()

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <div className="col-lg-2">
                    <a className="navbar-brand" href="#">Travel Buddy</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="col-lg-6">
                    <Autocomplete placeholder="Search for travel destinations" data={['data', 'data2']} radius='lg' icon={<IconSearch size={18} />} />
                </div>
                <div className="col-lg-4 d-flex justify-content-end">
                    <NotificationMenu />
                    <UserControlMenu />
                </div>
            </div>
        </nav>
    )
}

export default TopNavbar




export function NotificationMenu({ ...props }) {
    const theme = useMantineTheme();
    const [notifications,setNotifications]=useState<Notification[]>([])
    const {user}=useAuth()

    useEffect(()=>{
        if(!user)return
        const notificationsRef=ref(getDatabase(),`notifications/${user.uid}/`)
        const nlist:Notification[]=[]
        const unsubscribe=onValue(notificationsRef,snap=>{
            snap.forEach(notif=>{
                nlist.push(notif.val())
            })
            setNotifications(nlist)
        })
        return unsubscribe
    },[])
    

    return (
        <Menu
            position="top-end"
            width={220}
            withinPortal
            {...props}
        >
            <Menu.Target>
                <div className="dropdown-toggle cursor-pointer" role="button">
                    <img src={user?.photoURL || ''} alt="" className="avatar-sm" />
                </div>
            </Menu.Target>
            <Menu.Dropdown>
                {
                    notifications.map(n=>(<Menu.Item key={n.id}
                        icon={<IconCar size="1rem" color={theme.colors.pink[6]} stroke={1.5} />}
                    >
                        {n.content}
                    </Menu.Item>))
                }
            </Menu.Dropdown>
        </Menu>)

}

export function UserControlMenu() {
    const theme = useMantineTheme();
    const { user ,logout} = useAuth()
    return (
        <Menu
            position="top-end"
            width={220}
            withinPortal
        >
            <Menu.Target>
                <div className="dropdown-toggle cursor-pointer" role="button">
                    <img src={user?.photoURL || ''} alt="" className="avatar-sm" />
                </div>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                   
                    icon={<IconUser size="1rem" color={theme.colors.blue[6]} stroke={1.5} />}
                >
                    My Profile
                </Menu.Item>
                <Menu.Item
                    icon={<IconCar size="1rem" color={theme.colors.pink[6]} stroke={1.5} />}
                   
                >
                    My Travel Plans
                </Menu.Item>
                <Menu.Item
                    icon={<IconBook size="1rem" color={theme.colors.pink[6]} stroke={1.5} />}
                   
                >
                    My Bookings
                </Menu.Item>
                
                <Menu.Item
                    icon={<IconPower size="1rem" color={theme.colors.red[6]} stroke={1.5} />}
                    onClick={logout}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>)

}

