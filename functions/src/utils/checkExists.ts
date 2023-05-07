import { getFirestore } from 'firebase-admin/firestore'
import { ApiError } from './ApiError'

export const checkUserNameExists = async (username: string) => {
    const db = getFirestore()
    const query = db.collection('profiles').where('username', '==', username)
    const docs = await query.get()
    if(docs.size > 0)
        throw new ApiError('auth/username-exists','User with same username already exists!')
}


export const checkNameExists = async (firstname: string,lastname:string) => {
    const db = getFirestore()
    const query = db.collection('profiles').where('firstname', '==', firstname).where('lastname','==',lastname)
    const docs = await query.get()
    if(docs.size > 0)
        throw new ApiError('auth/name-exists','User with same name already exists!')
}