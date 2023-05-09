/* eslint-disable @next/next/no-img-element */
import { ActionIcon, Autocomplete, Avatar, Button, Divider, Indicator, Menu, Skeleton, ThemeIcon, useMantineTheme } from "@mantine/core"
import { IconBell, IconCar, IconPower, IconSearch, IconUser, IconUserPlus } from "@tabler/icons"
import { useAuth } from "data/hooks/useAuth"
import { useNotifications } from "data/hooks/useNotifications"
import { useTravelPlanInvites } from "data/hooks/useTravelPlanInvites"
import { Notification } from "data/models/user"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

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
                    <InvitationsMenu className='me-1' />
                    <NotificationMenu className='me-2' />
                    <UserControlMenu />
                </div>
            </div>
        </nav>
    )
}

export default TopNavbar




export function NotificationMenu({ ...props }) {
    const theme = useMantineTheme();
    const { user } = useAuth()

    const { notifications, loading, error } = useNotifications()

    return (
        <Menu
            position="top-end"
            width={300}
            withinPortal
            {...props}
        >
            <Menu.Target>
                <ActionIcon variant="subtle" color='blue'>
                    <IconBell size="1.2rem" />
                </ActionIcon>

            </Menu.Target>
            <Menu.Dropdown>
                {
                    loading && <Menu.Item
                        icon={<Skeleton height={25} circle mb="xl" />}

                    >
                        <Skeleton height={8} width="40%" radius="xl" />
                        <Skeleton height={8} mt='xs' width="70%" radius="xl" />
                    </Menu.Item>
                }
                {
                    notifications.length === 0 &&
                    <Menu.Item className="text-center"
                    >
                        <ThemeIcon color={theme.colors.gray[4]} className="me-2">
                            <IconBell size="1rem" stroke={2.5} color={theme.colors.gray[5]}  />
                        </ThemeIcon>
                        <p className="text-muted">No unseen Notification</p>
                    </Menu.Item>
                }
                {
                    notifications.map(n => (
                        <Menu.Item key={n.id}
                            icon={<IconBell size="1rem" color={theme.colors.gray[6]} stroke={1.5} />}
                        >
                            {n.content}
                        </Menu.Item>
                    ))
                }
            </Menu.Dropdown>

        </Menu>)

}

export function UserControlMenu() {
    const theme = useMantineTheme();
    const { user, logout, userProfile } = useAuth()

    return (
        <Menu
            position="top-end"

            withinPortal
        >
            <Menu.Target>
                <ActionIcon variant="subtle">
                    <div className="d-flex dropdown-toggle align-items-center" role="button">
                        <Avatar src={user?.photoURL} size='sm' />
                    </div>
                </ActionIcon>

            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>
                    <div className="d-flex align-items-center">
                        <Avatar src={user?.photoURL} size='md' />
                        <div className="ms-2">
                            <h5 className="h6 m-0 p-0">{`${userProfile?.firstname} ${userProfile?.lastname}`}</h5>
                            <small className="text-muted">{user?.email}</small>
                        </div>
                    </div>
                </Menu.Item>
                <Divider />
                <Menu.Item

                    icon={<IconUser size="1rem" color={theme.colors.blue[6]} stroke={1.5} />}
                >
                    My Profile
                </Menu.Item>
                <Menu.Item
                    icon={<IconCar size="1rem" color={theme.colors.pink[6]} stroke={1.5} />}>
                    My Travel Plans
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


export function InvitationsMenu({ ...props }) {
    const theme = useMantineTheme();

    const { user } = useAuth()
    const { invites, loading, error } = useTravelPlanInvites()

    const { push } = useRouter()

    return (
        <Menu
            position="top-end"
            width={300}
            withinPortal
            {...props}
        >
            <Menu.Target>

                <ActionIcon variant="subtle" >
                    <IconUserPlus size="1rem" stroke={2.5} color={theme.colors.primarycolor[0]} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {
                    invites.length === 0 &&
                    <Menu.Item className="text-center align-items-center"
                    >
                        <ThemeIcon color={theme.colors.gray[4]} className="me-2">
                            <IconUserPlus size="1rem" stroke={2.5} color={theme.colors.gray[5]}  />
                        </ThemeIcon>
                        <p className="text-muted">No unseen Invites</p>
                    </Menu.Item>
                }
                {
                    invites.map(n => (<Menu.Item key={n.id} onClick={() => push('/app/travelplan/' + n.travelPlan.id)}
                        icon={<ThemeIcon color={theme.colors.gray[6]} radius='xl'>
                            <IconUserPlus size="1rem" color={theme.colors.gray[2]} stroke={1.5} />
                        </ThemeIcon>}>
                        <p className="fw-bold m-0 mb-1 p-0">Invitation to join {n.owner.firstname}</p>
                        <p>{n.owner.firstname} {n.owner.lastname} is inviting you to join on his next trip to {n.travelPlan.destinations.map(d => d.name).join(', ')}</p>

                    </Menu.Item>))
                }
            </Menu.Dropdown>
        </Menu>)

}