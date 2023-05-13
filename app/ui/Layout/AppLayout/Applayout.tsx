import { useAppContext } from 'data/context/app-context'
import { ReactNode } from 'react'
import TopNavbar from '../../components/TopNavBar/TopNavbar'

interface AppLayoutProps {
    children?: ReactNode
    isFluid?:boolean
    [key: string]: any
}

const Applayout = ({ isFluid=false, children, ...props }: AppLayoutProps) => {

    return (
        <>
            <TopNavbar isFluid={isFluid}/>
            <main className={`container${isFluid ? '-fluid':''} pt-4`} {...props}>               
                
                {children}
            </main>
        </>
    )
}

export default Applayout