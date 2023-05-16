import { collection, doc, getDoc, getDocs, getFirestore, limit, query, updateDoc, where } from 'firebase/firestore';
import { app } from '../../firebase/init';
import { ShortProfile, UserProfile, UserProfileOverride, getShortProfileFromUserProfile } from '../models/user';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

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


export const saveBio = async (bio: string) => {
    const { currentUser } = getAuth()
    if (!currentUser)
        throw new Error('No user logged in.')
    const firestore = getFirestore(app)
    const profileDoc = doc(firestore, 'profiles', currentUser?.uid)
    await updateDoc(profileDoc, {
        bio
    })
}

export const updateProfile = async (newProfile: UserProfileOverride) => {
    const { currentUser } = getAuth()
    if (!currentUser)
        throw new Error('No user logged in.')
    const firestore = getFirestore(app)
    const profileDoc = doc(firestore, 'profiles', currentUser?.uid)
    const shortprofileDoc = doc(firestore, 'short-profiles', currentUser?.uid)
    
    await Promise.all([
        updateDoc(profileDoc, { ...newProfile }),
        updateDoc(shortprofileDoc, {...getShortProfileFromUserProfile(newProfile)})
    ])
}

export const updateAvatar = async (file: File) => {
    const { currentUser } = getAuth()
    if (!currentUser)
        throw new Error('No user logged in.')
    const storage = getStorage()
    const fileExtension = file.name.split('.')[1]
    const storagePath = 'assets/users/' + currentUser.uid + '/avatar/avatar.' + fileExtension
    await uploadBytes(ref(storage, storagePath), file);
    const downloadUrl = await getDownloadURL(ref(storage, storagePath))
    return downloadUrl
}


export async function getShortProfile(userId?: string) {
    
    const _userid = userId || getAuth().currentUser?.uid
    if (!_userid)
        throw new Error('No such user found')
    
    return ((await getDoc(doc(getFirestore(app), 'short-profiles', _userid))).data() as ShortProfile)
}
