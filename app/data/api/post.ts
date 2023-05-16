import { Like, Media, Post, PostRaw, ShortProfile } from "data/models/user";
import { getAuth } from "firebase/auth";
import { getDatabase, remove, set ,serverTimestamp as db_timestamp} from "firebase/database";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, increment, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { UploadTaskSnapshot, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { ref as rtdbRef } from "firebase/database";
import { v4 as uuid } from 'uuid';
import { getShortProfile } from "./profile";

const POST_COLLECTION='posts'

export type UploadProgressCallback = (snapshot: UploadTaskSnapshot) => any
export type UploadErrorCallback = (error: Error) => any
export type UploadSuccessCallback = () => any

export const addPost = async (post: PostRaw, progressCallback: UploadProgressCallback = () => { },
    errorCallback: UploadErrorCallback = () => { },
    successCallback: UploadSuccessCallback = () => { }) => {

    try {

        const user = getAuth().currentUser

        if (!user)
            throw new Error('Not authorized');

        const postId = uuid()

       // const ownerShortProfile = await getShortProfile(user.uid)
        let postObject: Post = {
            id: postId,
            ownerId: user.uid,
           // owner: ownerShortProfile,
            datetime: serverTimestamp(),
            text: post.text,
            likeIndex:[],
            likeCount:0,

        }

        const firestore = getFirestore();
        const docRef = doc(firestore, POST_COLLECTION, postId)
        await setDoc(docRef, postObject)

        const uploadPromises: Promise<Media>[] = post.images ? post.images?.map(img => uploadImage(postId, user.uid, img, progressCallback)) : []

        await updateDoc(docRef, {
            medias: await Promise.all(uploadPromises)
        })


    } catch (error) {
        console.error(error)
    }
}

export const uploadImage = async (postId: string, ownerId: string, file: File, updatecbk: UploadProgressCallback) => new Promise<Media>((resolve, reject) => {
    try {
        const storage = getStorage()
        const storageRoot = `posts/${postId}/media/images`
        const filename = `img_${uuid()}.${file.name.split('.')[1]}`
        const imageRef = ref(storage, `${storageRoot}/${filename}`)
        uploadBytesResumable(imageRef, file)
            .on('state_changed', updatecbk, reject, async () => {
                resolve({
                    mediaType: 'Image',
                    mediaUrl: await getDownloadURL(imageRef),
                    ownerId
                })
            })
    } catch (error) {
        reject(error)
    }
})


export async function getAllPosts(userid?: string) {
    const _userid = userid || getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    const posts: Post[] = []
    const firestore = getFirestore()
    const postQuery = query(collection(firestore, POST_COLLECTION)
        , where('ownerId', '==', _userid),orderBy('datetime','desc'))
    const snapshots = await getDocs(postQuery)
    snapshots.forEach(snap => {
        posts.push(
            snap.data() as Post
        )
    })
    return posts;
}


export async function likePost(postId:string){
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if(!postId)
        throw new Error('No post id given for like')

    const likesPath=`likes/${postId}/${_userid}`
    const ref=rtdbRef(getDatabase(),likesPath)    
    const newLike:Like=
    {
        ownerId: _userid,
        datetime: db_timestamp(),
    }
    await Promise.all([
        set(ref,newLike),
        updateDoc(doc(getFirestore(),POST_COLLECTION,postId),{
            likeCount:increment(1),
            likeIndex:arrayUnion(_userid)
        })
    ]) 
    return {...newLike,datetime:Date.now()};
}

export async function removeLike(postId:string){
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if(!postId)
        throw new Error('No post id given for like');
    
    
        const likesPath=`likes/${postId}/${_userid}`
        const ref=rtdbRef(getDatabase(),likesPath)
        await Promise.all([
            remove(ref),
            updateDoc(doc(getFirestore(),POST_COLLECTION,postId),{
                likeCount:increment(-1),
                likeIndex:arrayRemove(_userid)
            })
        ])
}

export async function getFeeds(){
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')
        
        const firestore=getFirestore()
        const followingsSnapshot=await getDocs(collection(firestore,'profiles',_userid,'following'))
        const followings=followingsSnapshot.docs.map(doc=>(doc.data() as ShortProfile).id)
        followings.push(_userid)
        console.log('following',followings)
        const postsSnapshot=await getDocs(
            query(collection(firestore,'posts'),
            where('ownerId','in',followings),
            orderBy('datetime','desc'))
    )

    return postsSnapshot.docs.map(doc=>doc.data()as Post)

}

// export async function likePost(postId:string){
//     const _userid = getAuth().currentUser?.uid

//     if (!_userid)
//         throw new Error('No user logged in')

//     if(!postId)
//         throw new Error('No post id given for like')
    
//     const firestore=getFirestore()
//     const likeCollection=collection(firestore,POST_COLLECTION,postId,'likes')
//     const likeDocRef=doc(likeCollection,_userid)
//     const newLike:Like={
//                 ownerId: _userid,
//                 datetime: serverTimestamp(),
//             }
//     const result=await setDoc(likeDocRef,newLike)
//     await updateDoc(doc(firestore,POST_COLLECTION,postId),{
//         likeIndex:arrayUnion()
//     })
//     return {...newLike,datetime:Date.now()};
// }

// export async function removeLike(postId:string){
//     const _userid = getAuth().currentUser?.uid

//     if (!_userid)
//         throw new Error('No user logged in')

//     if(!postId)
//         throw new Error('No post id given for like');
        
    
//         const firestore=getFirestore()
//         const likeCollection=collection(firestore,POST_COLLECTION,postId,'likes')
//         const likeDocRef=doc(likeCollection,_userid)
    
//         await deleteDoc(likeDocRef)
//         return true;
// }



