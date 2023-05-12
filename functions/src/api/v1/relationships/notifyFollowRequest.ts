import { database } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import { QueryDocumentSnapshot } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/https'
import { v4 as uuid } from 'uuid'
import { COLLECTION_FOLLOW_REQUESTS, COLLECTION_NOTIFICATION, NOTIFICATION_TYPE_FOLLOW_REQUEST_RECIEVED } from '../../../Constants'
import { FollowRequest, Notification } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'


const handleNotifyOnNewFollowRequest = async (snap: QueryDocumentSnapshot, context: functions.EventContext) => {

    try {
        if (!context.auth)
            throw new ApiError(401, 'Unauthorized')

        const rtdb = getDatabase()
        const followRequest: FollowRequest = snap.data() as FollowRequest
        const notificationId = uuid()

        const owner_data = await getAuth().getUser(context.auth.uid)

        const notification: Notification = {
            type: 'notification',
            id: notificationId,
            notificationType: NOTIFICATION_TYPE_FOLLOW_REQUEST_RECIEVED,
            title: 'Follow request recieved',
            content: `${owner_data.displayName} has requested to follow you.`,
            seen: false,
            datetime: database.ServerValue.TIMESTAMP
        }
        return rtdb.ref(COLLECTION_NOTIFICATION).child(followRequest.recipient).child(notificationId).set(notification)
    } catch (error) {
        if (error instanceof ApiError)
            return {
                message: error.message,
                code: error.code
            }
        throw new HttpsError('internal', (error as Error).message || 'Internal Error occured')
    }
}



export const notifyOnNewFollowRequest = functions.firestore
    .document(`${COLLECTION_FOLLOW_REQUESTS}/{docId}`)
    .onCreate(handleNotifyOnNewFollowRequest)