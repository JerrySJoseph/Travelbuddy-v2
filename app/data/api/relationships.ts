import { getAuth } from "firebase/auth"
import { collection, doc, getDoc, getFirestore, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { app } from "../../firebase/init"
import { FollowRequest } from "data/models/user"
import { get, getDatabase, ref } from "firebase/database"

export const sendFollowRequest = async (recipientId: string) => {

    try {
        const user = getAuth().currentUser
        if (!user) return false
        const functions = getFunctions(app)
        const sendFollowRequestFn = httpsCallable(functions, 'sendFollowRequest');
        const result = await sendFollowRequestFn({ recipientId })
        return true
    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }

}

export const acceptFollowRequest = async (followRequest: FollowRequest) => {

    try {
        const user = getAuth().currentUser
        if (!user) return false
        const functions = getFunctions(app)
        const acceptFollowRequestFn = httpsCallable(functions, 'acceptFollowRequest');
        const result = await acceptFollowRequestFn({ followRequest })
        return true
    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }

}

export const rejectFollowRequest = async (followRequest: FollowRequest) => {

    try {
        const user = getAuth().currentUser
        if (!user) return false
        const functions = getFunctions(app)
        const rejectFollowRequestFn = httpsCallable(functions, 'rejectFollowRequest');
        const result = await rejectFollowRequestFn({ followRequest })
        return true
    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }

}

export const unFollowUser = async (recipientId: string) => {

    try {
        const user = getAuth().currentUser
        if (!user) return false
        const functions = getFunctions(app)
        const unFollowFn = httpsCallable(functions, 'unFollow');
        const result = await unFollowFn({ recipientId,ownerId:user.uid })
        return true
    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }

}


export const checkFollowRequestSent = async (recipientId: string) => {

    try {
        const user = getAuth().currentUser
        if (!user) return false
        const rtdb = getDatabase(app)
        const docRef = ref(rtdb, 'follow-requests/' + recipientId+'/'+user.uid)
        const snapshot = await get(docRef)
        return snapshot.exists() && (snapshot.val() as FollowRequest).ownerId === user.uid

    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }

}

export const checkifFollowing = async (recipientId: string) => {

    try {
        const user = getAuth().currentUser
        if (!user) return false
        const rtdb = getDatabase(app)
        const docRef = ref(rtdb, 'relationships/'+user.uid+'/'+recipientId)
        const snapshot = await get(docRef)
        return snapshot.exists()

    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }

}

export const getFollowRequestsRecieved = async (max_results: number = 10) => {
    try {
        const user = getAuth().currentUser
        if (!user) return []
        
    } catch (error) {
        console.log('API ERROR', error)
        throw error
    }
}