import { UserProfile } from '../models/user';
import {getFirestore,collection,getDocs, getDoc,doc,query, where} from 'firebase/firestore/lite'

export const getAllUserProfiles=async()=>{
    const firestore=getFirestore()
    const querySnapshot=await getDocs(collection(firestore,'profiles'))
    return querySnapshot;

}

export const getUserProfileWithId=async(id:string)=>{
    const firestore=getFirestore()
    const documentSnapshot=await getDoc(doc(firestore,'profiles',id))
    if(documentSnapshot.exists())
        return documentSnapshot.data() as UserProfile
    throw new Error('Profile Not found')
}

export const getUserProfileWithName=async(firstname:string,lastname:string)=>{
    const firestore=getFirestore()
    const dbQuery=query(collection(firestore,'profiles'),where('firstname','==',firstname),where('lastname','==',lastname))
    const documentSnapshot=await getDocs(dbQuery)
    if(documentSnapshot.size==0)
        throw new Error('User Profile not found for '+firstname+" "+lastname)
    return documentSnapshot.docs[0].data() as UserProfile
}