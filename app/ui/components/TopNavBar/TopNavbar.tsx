/* eslint-disable @next/next/no-img-element */
import SearchComponent from "@components/SearchComponent/SearchComponent"
import { ActionIcon, Avatar, Button, Divider, Indicator, Loader, Menu, Skeleton, ThemeIcon, useMantineTheme } from "@mantine/core"
import { IconBell, IconCar, IconCheck, IconDashboard, IconPower, IconUserPlus } from "@tabler/icons"
import { acceptFollowRequest, rejectFollowRequest } from "data/api/relationships"
import { useAppContext } from "data/context/app-context"
import { useAuth } from "data/hooks/useAuth"
import { useFollowRequests } from "data/hooks/useFollowRequests"
import { useNotifications } from "data/hooks/useNotifications"
import { FollowRequest } from "data/models/user"
import { useRouter } from "next/router"
import { useState } from "react"


export interface ITopNavBarProps {
    isFluid?: boolean
}

const TopNavbar = ({ isFluid }: ITopNavBarProps) => {

    const { user } = useAuth()

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className={`container${isFluid ? '-fluid' : ''}`}>
                <div className="col-lg-3">
                    <Avatar src={'/img/panda.png'} size='md' />
                </div>
                <div className="col-lg-6">
                    <SearchComponent />
                </div>
                <div className="col-lg-3 d-flex justify-content-end">
                    <InvitationsMenu className='me-3' />
                    <NotificationMenu className='me-3' />
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
                <ActionIcon variant="subtle">
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
                            <IconBell size="1rem" stroke={2.5} color={theme.colors.gray[5]} />
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
    const { push } = useRouter()
    return (
        <Menu
            position="top-end"
            withinPortal
            withArrow
        >
            <Menu.Target>
                <ActionIcon variant="transparent">
                    <Avatar src={user?.photoURL} size='sm' />
                </ActionIcon>

            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>
                    <div className="d-flex align-items-center" onClick={() => push('/app/profile/' + user?.uid)}>
                        <Avatar src={user?.photoURL} size='md' />
                        <div className="ms-2">
                            <h5 className="h6 m-0 p-0">{`${userProfile?.firstname} ${userProfile?.lastname}`}</h5>
                            <small className="text-muted">{user?.email}</small>
                        </div>
                    </div>
                </Menu.Item>
                <Divider />
                <Menu.Item
                    onClick={() => push('/app/dashboard')}
                    icon={<IconDashboard size="1rem" color={theme.colors.blue[6]} stroke={1.5} />}
                >
                    My Dashboard
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
    const { requests} = useFollowRequests()


    return (
        <Menu
            closeOnItemClick={false}
            position="top-end"
            width={300}
            withinPortal
            {...props}
        >
            <Menu.Target>
                <Indicator position='top-end' offset={7} size={8} disabled={requests.length == 0}>
                    <ActionIcon variant="subtle">
                        <IconUserPlus size="1rem" stroke={2.5} />
                    </ActionIcon>
                </Indicator>
            </Menu.Target>
            <Menu.Dropdown>
                {
                    requests.length === 0 &&
                    <Menu.Item className="text-center"
                    >

                        <ThemeIcon color={theme.colors.gray[4]} className="mb-2">
                            <IconUserPlus size="1rem" stroke={2.5} color={theme.colors.gray[5]} />
                        </ThemeIcon>

                        <p className="text-muted">No pending follow requests.</p>
                    </Menu.Item>
                }
                {
                    requests.map((n, i) => (<>
                        <Menu.Item key={n.id}
                            icon={<Avatar src={n.owner.avatar} />}>
                            <p className="fw-bold m-0 mb-1 p-0">Follow request recieved</p>
                            <p>{n.owner.firstname} {n.owner.lastname} has requested to follow you.</p>
                            <div className="d-flex">
                                <RequestAcceptRejectButton followRequest={n} variant='accept' />
                                <RequestAcceptRejectButton followRequest={n} variant='reject' />
                            </div>

                        </Menu.Item>
                        {i !== requests.length - 1 &&
                            <Divider />}
                    </>))
                }
            </Menu.Dropdown>
        </Menu>)

}

interface IRequestAcceptRejectButtonProps {
    followRequest: FollowRequest,
    variant: 'accept' | 'reject'
}

const RequestAcceptRejectButton = ({ followRequest, variant = 'accept' }: IRequestAcceptRejectButtonProps) => {
    const { setError } = useAppContext();

    const [loading, setLoading] = useState<boolean>(false);

    async function handleAcceptOrReject() {
        try {
            setLoading(true)
            const fn = variant === 'accept' ? acceptFollowRequest : rejectFollowRequest
            await fn(followRequest)
        } catch (error) {
            setError(error as Error)
        } finally {
            setLoading(false);
        }
    }

    return <Button compact variant="outline" mr='md' onClick={handleAcceptOrReject}
        loading={loading} leftIcon={<IconCheck size={15} />} color={variant === 'reject' ? 'red' : 'green'}>{variant === 'accept' ? 'Accept' : 'Reject'}{loading && 'ing'}</Button>
}