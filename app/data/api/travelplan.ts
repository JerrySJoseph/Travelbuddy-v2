import { TravelPlan, TravelPlanInvite } from "data/models/user";
import {doc, getFirestore, getDoc} from 'firebase/firestore/lite'
import { getFunctions, httpsCallable } from "firebase/functions";
import {app} from "../../firebase/init";


export async function createNewTravelPlan(travelPlan:TravelPlan): Promise<Boolean> {

    try {
        const functions = getFunctions(app)
        const createNewTravelPlanFn = httpsCallable(functions, 'createNewTravelPlan');
        const result = await createNewTravelPlanFn({travelPlan})
        return true
    } catch (error) {
        console.log('API ERROR',error)
        throw error
    }

}

export async function acceptOrRejectTravelPlanInvite(travelPlanInvite:TravelPlanInvite): Promise<any> {

    try {
        const functions = getFunctions(app)
        const acceptOrRejectTravelPlanInviteFn = httpsCallable(functions, 'acceptOrRejectTravelPlan');
        const result = await acceptOrRejectTravelPlanInviteFn({travelPlanInvite})
        console.log('called api')
        return result.data
    } catch (error) {
        console.log('API ERROR',error)
        throw error
    }

}

export async function getTravelPlan(tpid:string):Promise<TravelPlan>{
    try {
        const firestore=getFirestore()
        const docRef=doc(firestore,'travel-plans',tpid)
        const travelPlanDoc=await getDoc(docRef)
        return travelPlanDoc.data() as TravelPlan
    } catch (error) {
        console.log('API ERROR',error)
        throw error
    }
}