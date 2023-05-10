import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { FollowRequest } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'
import { COLLECTION_FOLLOW_REQUESTS } from '../../../Constants'
import { HttpsError } from 'firebase-functions/v1/auth'


// save follow request object to DB
export const sendFollowRequest = functions.https.onCall((data, context) => {
    try {

        const { recipientId } = data

        if (!context.auth)
            throw new ApiError(401, 'Unauthorized')

        if (!recipientId)
            throw new ApiError(400, 'Bad request')

        const followRequestId = `${context.auth.uid}_${recipientId}`
        const followRequest: FollowRequest = {
            id: followRequestId,
            owner: context.auth.uid,
            recipient: recipientId,
            datetime: FieldValue.serverTimestamp(),
            status: 'PENDING'
        }

        const firestoreDB = getFirestore();
        return firestoreDB.collection(COLLECTION_FOLLOW_REQUESTS).doc(followRequestId).set(followRequest)

    } catch (error) {
        if (error instanceof ApiError)
            return {
                message: error.message,
                code: error.code
            }
        throw new HttpsError('internal', (error as Error).message || 'Internal Error occured')
    }

})