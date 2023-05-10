import * as functions from 'firebase-functions';


export const acceptOrRejectFollowRequest=functions.https.onCall((data,context)=>{
    return {data,context}
})