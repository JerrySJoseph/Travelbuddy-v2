import { createStyles } from '@mantine/core';
import AppContextProvider from '../data/context/app-context';
import login_hero from '../public/img/login_hero2.svg';
import { LoginForm } from '../ui/sections/LoginForm';
import { RegisterForm } from 'ui/sections/RegisterForm';

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

const Register = () => {

    return (
        <AppContextProvider>
            <div className={`container-fluid m-0 p-0 vh-100 d-flex justify-content-center align-items-center ${useStyles().classes.background}`}>
                <div className="card p-4 shadow col-lg-4">
                    <RegisterForm />
                </div>
            </div>
        </AppContextProvider>
    )
}

export default Register