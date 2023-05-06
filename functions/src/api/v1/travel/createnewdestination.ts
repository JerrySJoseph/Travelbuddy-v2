import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Destination} from "../../../models/user";
import {HttpsError} from "firebase-functions/lib/providers/auth";

admin.initializeApp();
const DESTINATIONS_COLLECTION = 'destinations';
export const createDestination = functions.https.onCall(async (data, context) => {
    try {
        const { name, city, country, attractions } = data;
        const newDestination: Destination = { id: '', name, city, country, attractions };
        const destinationRef = await admin.firestore().collection(DESTINATIONS_COLLECTION).add(newDestination);
        newDestination.id = destinationRef.id;
        return newDestination;
    } catch (error) {
        throw new HttpsError('internal',JSON.stringify(error))
    }
});
