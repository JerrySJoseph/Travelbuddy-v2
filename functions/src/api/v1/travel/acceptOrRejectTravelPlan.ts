import { getDatabase, } from 'firebase-admin/database'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/auth'
import { ShortProfile, TravelPlanInvite } from '../../../models/user'
import { ApiError } from '../../../utils/ApiError'


export const acceptOrRejectTravelPlan = functions.https.onCall(async (data, context) => {
    try {


        const { travelPlanInvite } = data


        if (!travelPlanInvite || !travelPlanInvite.type || travelPlanInvite.type !== 'travel-plan-invite')
            throw new ApiError(400, 'Insufficient params in request')

        const _tpi = travelPlanInvite as TravelPlanInvite

        if (!context.auth || context.auth.uid !== _tpi.recipient.id) {
            throw new HttpsError('permission-denied', 'Not Authorized')
        }

        const firestore = getFirestore()
        const rtdb = getDatabase()

        functions.logger.debug(travelPlanInvite)

        const currentUserProfile = (await firestore.collection('short-profiles').doc(context.auth.uid).get()).data() as ShortProfile
                
        
        await Promise.all([
            //change invite to ACCEPTED or REJECTED
            rtdb.ref('travel-plan-invites').child(context.auth.uid).child('invites').child(_tpi.id).remove(),
            _tpi.status==='ACCEPTED'?firestore.collection('travel-plans').doc(_tpi.travelPlan.id).update({
                'group.members':FieldValue.arrayUnion(currentUserProfile)
            }):new Promise<void>((res,rej)=>{
                res()
            })
        ])

        


        return {
            message: 'success',
            code: 200
        }


    } catch (error) {
        throw new HttpsError('unknown', (error as Error).message)
    }
})