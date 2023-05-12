import { Card, Center, Container, createStyles, Grid } from '@mantine/core';
import AppContextProvider from '../data/context/app-context';
import Applayout from '../ui/Layout/AppLayout/Applayout';
import { useCommonStyles } from '../Utils/commonStyles';
import { LoginForm } from '../ui/sections/LoginForm';
import login_hero from '../public/img/login_hero2.svg'

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

const App = () => {

    return (
        <AppContextProvider>
            <div className={`container-fluid m-0 p-0 vh-100 d-flex justify-content-center align-items-center ${useStyles().classes.background}`}>
                <Card shadow='xl'>
                    <LoginForm />
                </Card>
            </div>
        </AppContextProvider>
    )
}

export default App