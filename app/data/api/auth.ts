import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, connectAuthEmulator } from "firebase/auth"
import { app } from "../../firebase/init"
import parseFirebaseError from "../../firebase/firebaseErrorParser"
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'



export async function createNewUser(email: string, password: string, firstname: string, lastname: string, username: string): Promise<Boolean> {

    try {
        const functions = getFunctions(app)
        const createUserFn = httpsCallable(functions, 'createNewUser');
        const result = await createUserFn({
            email,
            password,
            firstname,
            lastname,
            username
        })
        return true
    } catch (error) {
        console.log('API ERROR',error)
        throw error
    }

}

export async function login(email: string, password: string): Promise<Boolean> {
    try {
        const auth = getAuth(app)
        const user = await signInWithEmailAndPassword(auth, email, password)
        return true
    } catch (error) {
        throw parseFirebaseError(error)
    }
}

