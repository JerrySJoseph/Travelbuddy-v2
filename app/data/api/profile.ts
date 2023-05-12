import { collection, doc, getDoc, getDocs, getFirestore, limit, query, where } from 'firebase/firestore';
import { app } from '../../firebase/init';
import { ShortProfile, UserProfile } from '../models/user';

export const getAllUserProfiles = async () => {
    const firestore = getFirestore(app)
    const querySnapshot = await getDocs(collection(firestore, 'profiles'))
    const userProfiles: UserProfile[] = []
    querySnapshot.forEach(snap => {
        userProfiles.push(snap.data() as UserProfile)
    })
    return userProfiles;

}

export const getUserProfileWithId = async (id: string) => {
    const firestore = getFirestore(app)
    const documentSnapshot = await getDoc(doc(firestore, 'profiles', id))
    if (documentSnapshot.exists())
        return documentSnapshot.data() as UserProfile
    throw new Error('Profile Not found')
}

export const getUserProfileWithName = async (firstname: string, lastname: string) => {
    const firestore = getFirestore(app)
    const dbQuery = query(collection(firestore, 'profiles'), where('firstname', '==', firstname), where('lastname', '==', lastname))
    const documentSnapshot = await getDocs(dbQuery)
    if (documentSnapshot.size == 0)
        throw new Error('User Profile not found for ' + firstname + " " + lastname)
    return documentSnapshot.docs[0].data() as UserProfile
}

export const searchUser = async (identifier: string = '', max_results: number = 10) => {
    identifier = identifier.toLowerCase()
    const firestore = getFirestore(app)
    const searchQuery = query(collection(firestore, 'short-profiles'),
        where('firstname', '>=', identifier),
        limit(max_results))
    const searchSnapshots = await getDocs(searchQuery)
    const results: ShortProfile[] = []
    console.log('results', results)
    searchSnapshots.forEach(snap => {
        results.push(snap.data() as ShortProfile)
    })
    return results;
}

