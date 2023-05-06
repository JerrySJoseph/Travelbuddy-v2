import TopBar from '@components/TopBar/TopBar'
import { AppShell, createStyles } from '@mantine/core'
import { ReactNode } from 'react'
import TopNavbar from '../../components/TopNavBar/TopNavbar'

interface AppLayoutProps {
    children?: ReactNode
    [key: string]: any
}

const Applayout = ({ children, ...props }: AppLayoutProps) => {

    return (
        <>
            <TopNavbar />
            <main className='container' {...props}>
                {children}
            </main>
        </>
    )
}

export default Applayout