import * as functions from 'firebase-functions';
import { FollowRequest } from '../../../models/user';
import { getFirestore,FieldValue } from 'firebase-admin/firestore';
import { ApiError } from '../../../utils/ApiError';
import { getDatabase } from 'firebase-admin/database';
import { COLLECTION_FOLLOW_REQUESTS, COLLECTION_RELATIONSHIPS } from '../../../Constants';


export const acceptFollowRequest = functions.https.onCall(async (data, context) => {
    const { followRequest } = data
    if (!followRequest)
        throw new ApiError(400, 'Bad Request')
    const fr = followRequest as FollowRequest
    const firestore = getFirestore()
    await Promise.all([
        // add owner as follower to the recipients profile
        firestore.collection('profiles').doc(fr.recipient.id).collection('followers').doc(fr.owner.id).set(fr.owner),
        //increase follower count
        firestore.collection('profiles').doc(fr.recipientId).update({
            followersCount:FieldValue.increment(1)
        }),
        // add recipient as following to owners profile
        firestore.collection('profiles').doc(fr.owner.id).collection('following').doc(fr.recipient.id).set(fr.recipient),
        // increase following count
        firestore.collection('profiles').doc(fr.ownerId).update({
            followedCount:FieldValue.increment(1)
        }),
        
        //delete follow request
        getDatabase().ref(COLLECTION_FOLLOW_REQUESTS).child(fr.recipientId).child(fr.ownerId).remove(),
        
        //update relationship index
        getDatabase().ref(COLLECTION_RELATIONSHIPS).child(fr.ownerId).child(fr.recipientId).set(true)
    ])
})

export const rejectFollowRequest = functions.https.onCall((data, context) => {

    const { followRequest } = data
    if (!followRequest)
        throw new ApiError(400, 'Bad Request')

    const fr = followRequest as FollowRequest
    return getDatabase().ref(COLLECTION_FOLLOW_REQUESTS).child(fr.recipientId).child(fr.ownerId).remove()
    
})