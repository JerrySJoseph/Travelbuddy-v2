import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Destination} from "../../../models/user";
import {HttpsError} from "firebase-functions/lib/providers/auth";

const DESTINATIONS_COLLECTION = 'destinations';

export const createDestination = functions.https.onCall(async (data, context) => {
    try {
        const { name, city, country, attractions, reviews } = data;
        const newDestination: Destination = {
            id: '',
            name,
            city,
            country,
            attractions,
            reviews: reviews || [] // if no reviews provided init to empty array
        };

        const destinationRef = await admin.firestore().collection(DESTINATIONS_COLLECTION).add(newDestination);
        newDestination.id = destinationRef.id;
        return newDestination;
    } catch (error) {
        throw new HttpsError('internal',JSON.stringify(error))
    }
});
