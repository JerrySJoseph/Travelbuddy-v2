import TopBar from '@components/TopBar/TopBar'
import { AppShell, createStyles } from '@mantine/core'
import { ReactNode } from 'react'
import TopNavbar from '../../components/TopNavBar/TopNavbar'

interface AppLayoutProps {
    children?: ReactNode
    [key: string]: any
}

const useStyles = createStyles((theme) => ({
    mainContainer: {
        // border: '3px solid blue',
        // height: '100%',
        // width: '100%',
        // margin: 0,
        // padding: 0
    }
}))

const Applayout = ({ children, ...props }: AppLayoutProps) => {

    const { classes } = useStyles();

    return (
        <>
            <TopBar />
            <TopNavbar />
            <main {...props}>
                {children}
            </main>
        </>
    )
}

export default Applayout