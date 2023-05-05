import * as functions from 'firebase-functions'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import { UserProfile } from '../../../models/user'
import { HttpsError } from 'firebase-functions/v1/auth'

export const createNewUser=functions.https.onCall(async(data,context)=>{
    
    try {
        const {email,password,firstname,lastname,username}=data
        const userRecord=await getAuth().createUser({
            email,
            emailVerified:false,
            password,
            displayName:`${firstname} ${lastname}`,
            photoURL: 'https://d11b3pf7ulbs6a.cloudfront.net/static/img/panda.png',
            disabled:false
        })
        const userProfile:UserProfile={
            id: userRecord.uid,
            firstname,
            lastname,
            username,
            email,
            bio: '',
            avatar: ''
        }
        await getFirestore().collection('profiles').doc(userRecord.uid).set(userProfile)
        return userProfile
        
    } catch (error) {
        throw new HttpsError('internal',(error as Error).message)
    }
    
})