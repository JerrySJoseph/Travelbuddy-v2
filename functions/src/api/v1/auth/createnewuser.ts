import * as functions from 'firebase-functions'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import { ShortProfile, UserProfile } from '../../../models/user'
import { HttpsError } from 'firebase-functions/v1/auth'
import { checkNameExists, checkUserNameExists } from '../../../utils/checkExists'
import { ApiError } from '../../../utils/ApiError'
import { URL_DEFAULT_AVATAR } from '../../../Constants'

export const createNewUser=functions.https.onCall(async(data,context)=>{
    
    try {
        const {email,password,firstname,lastname,username}=data
        
        if(!email ||!password ||!firstname || !lastname || !username)
            throw new ApiError(400,'Insufficient params in request')
        
        await checkUserNameExists(username);
        await checkNameExists(firstname,lastname)

        const userRecord=await getAuth().createUser({
            email,
            emailVerified:false,
            password,
            displayName:`${firstname} ${lastname}`,
            photoURL: URL_DEFAULT_AVATAR,
            disabled:false
        })
        
        const userProfile:UserProfile={
            id: userRecord.uid,
            firstname,
            lastname,
            username,
            email,
            bio: '',
            avatar: URL_DEFAULT_AVATAR,
            travelPlans: [],
            type: 'user-profile',
            followersCount: 0,
            followedCount: 0
        }
        
        const shortProfile:ShortProfile={
            type: 'short-profile',
            id: userRecord.uid,
            firstname,
            lastname,
            username,
            avatar: URL_DEFAULT_AVATAR
        }

        await Promise.all([
            getFirestore().collection('profiles').doc(userRecord.uid).set(userProfile),
            getFirestore().collection('short-profiles').doc(userRecord.uid).set(shortProfile)
        ])
       
        return userProfile
        
    } catch (error) {
            throw new HttpsError('unknown',(error as Error).message)
    }
    
})