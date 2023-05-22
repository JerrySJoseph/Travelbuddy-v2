import parseFirebaseError from "../firebase/firebaseErrorParser";
import { getFirestore, collection, onSnapshot, doc, Query } from "firebase/firestore";


export function addOnCollectionChangeListener<T>(collectionName: string, callback: (newData: T[]) => any) {
    try {

        const firestore = getFirestore();
        const collectionRef = collection(firestore, collectionName);

        //register a snapshot change listener for fetching data on changes
        const unsubscribe = onSnapshot(collectionRef, (docs) => {

            const fetchedList: T[] = [];
            //parse snapshot array-> Page array
            docs.forEach(document => {
                fetchedList.push(document.data() as T)
            });

            //callback invoked after sanitizing new data
            callback(fetchedList);

            //throw error as it is for handling
        }, (error) => { throw error })

        return unsubscribe;

    } catch (error) {
        throw parseFirebaseError(error);
    }
}


export function addOnQueryChangeListener<T>(query:Query, callback: (newData: T[]) => any) {
    try {

        const firestore = getFirestore();
        //register a snapshot change listener for fetching data on changes
        const unsubscribe = onSnapshot(query, (docs) => {

            const fetchedList: T[] = [];
            //parse snapshot array-> Page array
            docs.forEach(document => {
                fetchedList.push(document.data() as T)
            });

            //callback invoked after sanitizing new data
            callback(fetchedList);

            //throw error as it is for handling
        }, (error) => { throw error })

        return unsubscribe;

    } catch (error) {
        throw parseFirebaseError(error);
    }
}


export function addOnDocumentChangeListener<T>(collectionName: string, docName: string, callback: (newData: T) => any) {
    try {

        const firestore = getFirestore();
        const docRef = doc(firestore, collectionName, docName);

        //register a snapshot change listener for fetching data on changes
        const unsubscribe = onSnapshot(docRef, (doc) => {

            //callback invoked after sanitizing new data
            callback(doc.data() as T);

            //throw error as it is for handling
        }, (error) => { throw error })

        return unsubscribe;

    } catch (error) {
        throw parseFirebaseError(error);
    }
}
