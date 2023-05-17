import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/auth'
import { ApiError } from '../../../utils/ApiError'
import { getDatabase } from 'firebase-admin/database'
import { COLLECTION_RELATIONSHIPS } from '../../../Constants'

export const unFollow=functions.https.onCall(async (data,context)=>{
    try {

        const { recipientId,ownerId } = data

        if (!context.auth)
            throw new ApiError(401, 'Unauthorized')

        if (!recipientId)
            throw new ApiError(400, 'Bad request')

        
        const firestoreDB = getFirestore();
        return await Promise.all([
            //remove recipient from following of owner
            firestoreDB.collection('profiles').doc(ownerId).collection('following').doc(recipientId).delete(),
            
            //decrease followed count of owner
            firestoreDB.collection('profiles').doc(ownerId).update({
                followedCount:FieldValue.increment(-1)
            }),

            // remove owner from recipients following
            firestoreDB.collection('profiles').doc(recipientId).collection('followers').doc(ownerId).delete(),
            
            //decrease follower count of recipient
            firestoreDB.collection('profiles').doc(recipientId).update({
                followersCount:FieldValue.increment(-1)
            }),

            //update relationship index
            getDatabase().ref(COLLECTION_RELATIONSHIPS).child(ownerId).child(recipientId).remove()
        ])
        

    } catch (error) {
        if (error instanceof ApiError)
            return {
                message: error.message,
                code: error.code
            }
        throw new HttpsError('internal', (error as Error).message || 'Internal Error occured')
    }
})