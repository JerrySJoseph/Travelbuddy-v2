import { database } from 'firebase-admin'
import { getDatabase } from 'firebase-admin/database'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/auth'
import { v4 as uuid } from 'uuid'
import { Notification, TravelPlan, TravelPlanInvite, UserProfile } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'

export const createNewTravelPlan = functions.https.onCall(async (data, context) => {
    try {

        if (!context.auth) {
            throw new HttpsError('permission-denied', 'Not Authorized')
        }

        const { travelPlan } = data

        functions.logger.warn(data)
        if (!travelPlan || !travelPlan.type || travelPlan.type !== 'travel-plan')
            throw new ApiError('auth/insufficient-params', 'Insufficient params in request')

        const _tp = travelPlan as TravelPlan

        const firestore = getFirestore()
        const rtdb = getDatabase()
        await firestore.collection('travel-plans').doc(_tp.id).set(travelPlan)

        const currentUser = (await firestore.collection('profiles').doc(context.auth.uid).get()).data() as UserProfile

        

        //create invites
        const invitePromises: Promise<any>[] = []
        _tp.inviteMembers.forEach(async m => {

            //send notifications
            const notification: Notification = {
                id: uuid(),
                type: 'notification',
                notificationType: 'notif-travelplan-invite',
                title: 'You have been invited',
                content: `${currentUser.firstname} has invited you to join his next trip.`,
                datetime: database.ServerValue.TIMESTAMP
            }
        
            invitePromises.push(rtdb.ref('notifications').child(m.id).child(notification.id).set(notification))

            // send invites
            const tpInvite: TravelPlanInvite = {
                type: 'travel-plan-invite',
                id: uuid(),
                owner: currentUser,
                travelPlan: _tp,
                datetime: FieldValue.serverTimestamp(),
                recipient: m,
                status: 'PENDING'
            }

            invitePromises.push(rtdb.ref('travel-plan-invites').child(m.id).child('invites').child(tpInvite.id).set(tpInvite))
        })
        await Promise.all(invitePromises)

        return {
            message: 'success',
            code: 200
        }


    } catch (error) {
        throw new HttpsError('unknown', (error as Error).message)
    }
})