import {getFirestore,collection,getDocs} from 'firebase/firestore/lite'

export const getAllUserProfiles=async()=>{
    const firestore=getFirestore()
    const querySnapshot=await getDocs(collection(firestore,'profiles'))
    return querySnapshot;

}