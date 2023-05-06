import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {UserReview} from "../../../models/user";
import {HttpsError} from "firebase-functions/lib/providers/auth";

const REVIEWS_COLLECTION = 'reviews';
export const createReview = functions.https.onCall(async (data, context) => {
    try {
        const { owner, rating, comment, verified } = data;
        const newReview: UserReview = {
            id: '',
            owner,
            rating,
            comment,
            verified: verified || false,
            datetime: admin.firestore.FieldValue.serverTimestamp() // user server time
        };
        const reviewRef = await admin.firestore().collection(REVIEWS_COLLECTION).add(newReview);
        newReview.id = reviewRef.id;
        return newReview;
    } catch (error) {
        throw new HttpsError('internal',JSON.stringify(error))
    }
});
