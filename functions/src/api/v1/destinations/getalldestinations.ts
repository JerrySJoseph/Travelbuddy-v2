import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Destination} from "../../../models/user";
import {HttpsError} from "firebase-functions/lib/providers/auth";

const DESTINATIONS_COLLECTION = 'destinations';

const db = admin.firestore();

export const getAllDestinations = functions.https.onCall(async (data, context) => {
    try {
        const destinationCollection = db.collection(DESTINATIONS_COLLECTION);
        const snapshot = await destinationCollection.get();

        const destinations: Destination[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            const destination: Destination = {
                id: doc.id,
                name: data.name,
                city: data.city,
                country: data.country,
                attractions: data.attractions,
                reviews: data.reviews,
            };
            destinations.push(destination);
        });

        return destinations;
    } catch (error) {
        throw new HttpsError('internal',JSON.stringify(error))
    }
});
