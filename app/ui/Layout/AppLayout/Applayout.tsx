import TopBar from '@components/TopBar/TopBar'
import { Alert, AppShell, createStyles } from '@mantine/core'
import { ReactNode } from 'react'
import TopNavbar from '../../components/TopNavBar/TopNavbar'
import { IconAlertCircle } from '@tabler/icons'
import { useAppContext } from 'data/context/app-context'

interface AppLayoutProps {
    children?: ReactNode
    [key: string]: any
}

const Applayout = ({ children, ...props }: AppLayoutProps) => {

    const { error } = useAppContext();
    return (
        <>
            <TopNavbar />

            <main className='container-fluid pt-4' {...props}>
                {
                    error &&
                    <Alert icon={<IconAlertCircle size="1rem" />} title="Error Occured!" color="red" className='mb-4'>
                        {error.message}
                    </Alert>
                }
                {children}
            </main>
        </>
    )
}

export default Applayout