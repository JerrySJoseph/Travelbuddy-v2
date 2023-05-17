import * as functions from 'firebase-functions'
import { Post, ShortProfile,Notification } from '../../../models/user'
import { getFirestore } from 'firebase-admin/firestore'
import { getDatabase ,ServerValue} from 'firebase-admin/database'
import {v4 as uuid} from 'uuid'
import { capitalizeFirstLetter } from '../../../utils/stringUtils'

interface Update{
    [key:string]:any
}

export const notifyFollowersOnNewPost = functions.firestore.document('posts/{postId}').onCreate(async (snapshot, context) => {
    const newPost = snapshot.data() as Post
    const followersSnapshot = await getFirestore().collection('profiles')
        .doc(newPost.ownerId)
        .collection('followers').get()
    const owner=(await getFirestore().collection('short-profiles').doc(newPost.ownerId).get()).data() as ShortProfile
    const followerIds=followersSnapshot.docs.map(doc=>(doc.data() as ShortProfile).id);
    const notificationsRef=getDatabase().ref('notifications')
    const updates:Update={}

    const notificationObject:Notification={
        type: 'notification',
        id: uuid(),
        notificationType: 'new-post',
        title: 'New Post',
        content: `${capitalizeFirstLetter(owner.firstname)} added a new post. Don't miss out!`,
        datetime: ServerValue.TIMESTAMP
    }

    followerIds.forEach(id=>{
        updates[`${id}/${notificationObject.id}`]=notificationObject
    })
    return notificationsRef.update(updates)
})