/* eslint-disable @next/next/no-img-element */
import { Autocomplete, Button, Menu, useMantineTheme, Text } from "@mantine/core"
import { IconBook, IconCalendar, IconChevronDown, IconPackage, IconPower, IconSearch, IconSquareCheck, IconUser, IconUsers } from "@tabler/icons"
import { useAuth } from "data/hooks/useAuth"


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
                    <UserControlMenu />
                </div>
            </div>
        </nav>
    )
}

export default TopNavbar



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
                    <img src={user?.photoURL} alt="" className="avatar-sm" />
                </div>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    icon={<IconUser size="1rem" color={theme.colors.blue[6]} stroke={1.5} />}
                    
                >
                    My Profile
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