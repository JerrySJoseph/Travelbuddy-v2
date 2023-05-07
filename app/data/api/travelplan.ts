import { TravelPlan } from "data/models/user";
import {doc, getFirestore, setDoc} from 'firebase/firestore/lite'
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