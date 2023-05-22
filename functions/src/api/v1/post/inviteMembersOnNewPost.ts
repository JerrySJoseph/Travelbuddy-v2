import { ServerValue, getDatabase } from 'firebase-admin/database'
import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { v4 as uuid } from 'uuid'
import { Post, ShortProfile } from '../../../models/user'

interface Update {
    [key: string]: any
}

export const inviteMembersOnNewPost = functions.firestore.document('posts/{postId}').onCreate(async (snapshot, context) => {
    const newPost = snapshot.data() as Post
    if (!newPost.travelPlan || newPost.travelPlan.inviteMembers.length === 0)
        return;

    const owner = (await getFirestore().collection('short-profiles').doc(newPost.ownerId).get()).data() as ShortProfile
    const memberIds = newPost.travelPlan.inviteMembers;
    const invitationsRef = getDatabase().ref('travel-plan-invites')
    const updates: Update = {}



    memberIds.forEach(id => {
        const invitedId = uuid()
        updates[`${id}/${invitedId}`] = {
            type: 'travel-plan-invite',
            id: invitedId,
            ownerId: owner.id,
            travelPlan: newPost.travelPlan,
            datetime: ServerValue.TIMESTAMP,
            recipientId: id,
            status: 'PENDING'
        }
    })
    return invitationsRef.update(updates)
})