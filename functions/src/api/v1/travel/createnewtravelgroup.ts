import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {TravelGroup} from "../../../models/user";
import {HttpsError} from "firebase-functions/lib/providers/auth";

const TRAVEL_GROUPS_COLLECTION = 'travelGroups';

export const createTravelGroup = functions.https.onCall(async (data, context) => {
    try {
        const { name, createdBy, slots, members, travellingDateRange, summary } = data;

        const newTravelGroup: TravelGroup = {
            id: '',
            name,
            createdBy,
            slots,
            members: members || [],
            travellingDateRange,
            summary
        };

        const travelGroupRef = await admin.firestore().collection(TRAVEL_GROUPS_COLLECTION).add(newTravelGroup);
        newTravelGroup.id = travelGroupRef.id;
        return newTravelGroup;
    } catch (error) {
        throw new HttpsError('internal',JSON.stringify(error))
    }
});
