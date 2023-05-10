import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/https'
import { COLLECTION_RELATIONSHIPS } from '../../../Constants'
import { Relationship } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'


export const getFollowers = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth)
            throw new ApiError(401, 'Unauthorized')

        const limit=data.limit || 10
        const page=data.page || 0

        const currentUserId=context.auth.uid

        const relationsshipSnapshot = await getFirestore().collection(COLLECTION_RELATIONSHIPS)
            .where('followedId','==',currentUserId)
            .orderBy('datetime','desc')
            .startAfter(page*limit)
            .limit(limit)
            .get()
        
        const relationsships:Relationship[]=[]
        relationsshipSnapshot.forEach(snap=>{
            relationsships.push(snap.data() as Relationship)
        })
        return relationsships

    } catch (error) {
        if (error instanceof ApiError)
            return {
                message: error.message,
                code: error.code
            }
        throw new HttpsError('internal', (error as Error).message || 'Internal Error occured')
    }
})