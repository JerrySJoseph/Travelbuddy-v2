import { ref, getDatabase, onValue, onChildAdded, onChildMoved, onChildChanged, onChildRemoved } from 'firebase/database'
import parseFirebaseError from '../firebase/firebaseErrorParser'


export const addOnDataChangeListener = <T>(path: string, callback: (newData: T[]) => any) => {

    try {
        const rtdb = getDatabase()
        const docRef = ref(rtdb, path)
        return onValue(docRef, (docs) => {
            const fetchedList: T[] = [];
            //parse snapshot array-> Page array
            docs.forEach(document => {
                fetchedList.push(document.val() as T)
            });

            //callback invoked after sanitizing new data
            callback(fetchedList);
        }, error => { throw error })

    } catch (error) {
        throw parseFirebaseError(error);
    }

}

export const addOnChildAddedListener = <T>(path: string, callback: (newData: T) => any) => {

    try {
        const rtdb = getDatabase()
        const docRef = ref(rtdb, path)
        return onChildAdded(docRef, (doc) => {
            //callback invoked after sanitizing new data
            callback(doc.val() as T);
        }, error => { throw error })

    } catch (error) {
        throw parseFirebaseError(error);
    }

}

export const addOnChildMovedListener = <T>(path: string, callback: (newData: T) => any) => {

    try {
        const rtdb = getDatabase()
        const docRef = ref(rtdb, path)
        return onChildMoved(docRef, (doc) => {
             //callback invoked after sanitizing new data
             callback(doc.val() as T);
        }, error => { throw error })

    } catch (error) {
        throw parseFirebaseError(error);
    }

}

export const addOnChildChangedListener = <T>(path: string, callback: (newData: T) => any) => {

    try {
        const rtdb = getDatabase()
        const docRef = ref(rtdb, path)
        return onChildChanged(docRef, (doc) => {
             //callback invoked after sanitizing new data
             callback(doc.val() as T);
        }, error => { throw error })

    } catch (error) {
        throw parseFirebaseError(error);
    }

}

export const addOnChildRemovedListener = <T>(path: string, callback: (newData: T) => any) => {

    try {
        const rtdb = getDatabase()
        const docRef = ref(rtdb, path)
        return onChildRemoved(docRef, (doc) => {
             //callback invoked after sanitizing new data
             callback(doc.val() as T);
        }, error => { throw error })

    } catch (error) {
        throw parseFirebaseError(error);
    }

}