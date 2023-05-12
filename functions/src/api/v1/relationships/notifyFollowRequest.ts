import { database } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/https'
import { v4 as uuid } from 'uuid'
import { COLLECTION_FOLLOW_REQUESTS, COLLECTION_NOTIFICATION, NOTIFICATION_TYPE_FOLLOW_REQUEST_RECIEVED } from '../../../Constants'
import { FollowRequest, Notification } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'


const handleNotifyOnNewFollowRequest = async (snap: functions.database.DataSnapshot) => {

    try {

        const rtdb = getDatabase()
        const followRequest: FollowRequest = snap.val() as FollowRequest
        const notificationId = uuid()

        functions.logger.debug('New follow request detected. Sending Notification to ', followRequest.recipient.firstname)

        const owner_data = await getAuth().getUser(followRequest.owner.id)

        const notification: Notification = {
            type: 'notification',
            id: notificationId,
            notificationType: NOTIFICATION_TYPE_FOLLOW_REQUEST_RECIEVED,
            title: 'Follow request recieved',
            content: `${owner_data.displayName} has requested to follow you.`,
            seen: false,
            datetime: database.ServerValue.TIMESTAMP
        }

        await rtdb.ref(COLLECTION_NOTIFICATION).child(followRequest.recipientId).child(notificationId).set(notification)
        functions.logger.debug('New follow request notification sent to ', followRequest.recipient.firstname)
        return true;

    } catch (error) {
        functions.logger.error(error)
        if (error instanceof ApiError)
            return {
                message: error.message,
                code: error.code
            }

        throw new HttpsError('internal', (error as Error).message || 'Internal Error occured')
    }
}



export const notifyOnNewFollowRequest = functions.database
    .ref(`/${COLLECTION_FOLLOW_REQUESTS}/{user1}/{user2}/{followrequestId}`)
    .onCreate(handleNotifyOnNewFollowRequest)
