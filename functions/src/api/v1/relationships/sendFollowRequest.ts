import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { FollowRequest, ShortProfile } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'
import { COLLECTION_FOLLOW_REQUESTS } from '../../../Constants'
import { HttpsError } from 'firebase-functions/v1/auth'
import { getDatabase } from 'firebase-admin/database'
import {v4 as uuid} from 'uuid'

// save follow request object to DB
export const sendFollowRequest = functions.https.onCall(async (data, context) => {
    try {

        const { recipientId } = data

        if (!context.auth)
            throw new ApiError(401, 'Unauthorized')

        if (!recipientId)
            throw new ApiError(400, 'Bad request')

        const followRequestId = uuid()
        const firestoreDB = getFirestore();

        const [ownerShortProfile, recipientShortProfile] = await Promise.all([
            (firestoreDB.collection('short-profiles').doc(context.auth.uid).get()),
            (firestoreDB.collection('short-profiles').doc(recipientId).get()),
        ])

        const followRequest: FollowRequest = {
            id: followRequestId,
            ownerId: context.auth.uid,
            owner: ownerShortProfile.data() as ShortProfile,
            recipient: recipientShortProfile.data() as ShortProfile,
            recipientId: recipientId,
            datetime: FieldValue.serverTimestamp(),
            status: 'PENDING'
        }

        return getDatabase().ref(COLLECTION_FOLLOW_REQUESTS).child(recipientId).child(context.auth.uid).set(followRequest)

    } catch (error) {
        if (error instanceof ApiError)
            return {
                message: error.message,
                code: error.code
            }
        throw new HttpsError('internal', (error as Error).message || 'Internal Error occured')
    }

})