import { useAppContext } from 'data/context/app-context'
import { ReactNode } from 'react'
import TopNavbar from '../../components/TopNavBar/TopNavbar'
import { createStyles } from '@mantine/core'
import login_hero from '../../../public/img/login_hero.svg'

interface AppLayoutProps {
    children?: ReactNode
    isFluid?:boolean
    [key: string]: any
}

const useStyles = createStyles((theme) => ({
    mainContainer: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
    },
    background: {
        width: '100%',
        backgroundImage: `url(${login_hero.src})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        height: '100%'
    },
    mainContent: {
        position: 'relative',
        height: '100%'
    }
}))

const Applayout = ({ isFluid=false, children, ...props }: AppLayoutProps) => {

    return (
        <>
            <TopNavbar isFluid={isFluid}/>
            <main className={`container${isFluid ? '-fluid':''} pt-4 background`} {...props}>               
                
                {children}
            </main>
        </>
    )
}

export default Applayout