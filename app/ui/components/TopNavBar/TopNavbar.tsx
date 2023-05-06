/* eslint-disable @next/next/no-img-element */
import { Autocomplete, Button, Menu, useMantineTheme, Text } from "@mantine/core"
import { IconCalendar, IconChevronDown, IconPackage, IconSearch, IconSquareCheck, IconUsers } from "@tabler/icons"
import { useAuth } from "data/hooks/useAuth"


const TopNavbar = () => {

    const { user } = useAuth()


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
    const { user } = useAuth()
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
                    icon={<IconPackage size="1rem" color={theme.colors.blue[6]} stroke={1.5} />}
                    rightSection={
                        <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                            Ctrl + P
                        </Text>
                    }
                >
                    Project
                </Menu.Item>
                <Menu.Item
                    icon={<IconSquareCheck size="1rem" color={theme.colors.pink[6]} stroke={1.5} />}
                    rightSection={
                        <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                            Ctrl + T
                        </Text>
                    }
                >
                    Task
                </Menu.Item>
                <Menu.Item
                    icon={<IconUsers size="1rem" color={theme.colors.cyan[6]} stroke={1.5} />}
                    rightSection={
                        <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                            Ctrl + U
                        </Text>
                    }
                >
                    Team
                </Menu.Item>
                <Menu.Item
                    icon={<IconCalendar size="1rem" color={theme.colors.violet[6]} stroke={1.5} />}
                    rightSection={
                        <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                            Ctrl + E
                        </Text>
                    }
                >
                    Event
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>)

}