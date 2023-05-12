import { createNewUser } from "../data/api/auth";

export const createDummyUsers = () => {
    const users = ['Jerin Sebastian', 'Zain Haque', 'Talib Mirza', 'Hayat Ali', 'Arjun Joshua', 'Vipasha Badani', 'Maanya Vij', 'Avaneish Srijith', 'Shikhar Sharma',
        'Dhruv Singhal', 'Prashant Pal', 'Archish Kare', 'Nachiketh Mallappa', 'Noel John', 'Shail Chauhan', 'Adwait Vaishnavi', 'Pranay Krishna', 'Rohan Roy', 'Raj Kumar',
        'John Doe']

    users.forEach(async u => {
        try {
            const [firstname, lastname] = u.split(' ')
            const email = firstname + '@mail.com'
            const username = firstname
            const password = 'root123'
            await createNewUser(email, password, firstname, lastname, username)
        } catch (error) {
            console.log(error)
        }
    })

}
