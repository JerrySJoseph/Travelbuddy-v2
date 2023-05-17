import { Like, Media, Post, PostRaw, ShortProfile, UserComment } from "data/models/user";
import { getAuth } from "firebase/auth";
import { getDatabase, remove, set, serverTimestamp as db_timestamp, DataSnapshot } from "firebase/database";
import { DocumentSnapshot, arrayRemove, arrayUnion, collection, deleteDoc, doc, getCountFromServer, getDocs, getFirestore, increment, limit, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from "firebase/firestore";
import { UploadTaskSnapshot, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { ref as rtdbRef } from "firebase/database";
import { v4 as uuid } from 'uuid';
import { getShortProfile } from "./profile";

const POST_COLLECTION = 'posts'

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
            likeIndex: [],
            likeCount: 0,
            travelPlan: post.travelPlan
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
        , where('ownerId', '==', _userid), orderBy('datetime', 'desc'))
    const snapshots = await getDocs(postQuery)
    snapshots.forEach(snap => {
        posts.push(
            snap.data() as Post
        )
    })
    return posts;
}


export async function likePost(postId: string) {
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if (!postId)
        throw new Error('No post id given for like')

    const likesPath = `likes/${postId}/${_userid}`
    const ref = rtdbRef(getDatabase(), likesPath)
    const newLike: Like =
    {
        ownerId: _userid,
        datetime: db_timestamp(),
    }
    await Promise.all([
        set(ref, newLike),
        updateDoc(doc(getFirestore(), POST_COLLECTION, postId), {
            likeCount: increment(1),
            likeIndex: arrayUnion(_userid)
        })
    ])
    return { ...newLike, datetime: Date.now() };
}

export async function removeLike(postId: string) {
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if (!postId)
        throw new Error('No post id given for like');


    const likesPath = `likes/${postId}/${_userid}`
    const ref = rtdbRef(getDatabase(), likesPath)
    await Promise.all([
        remove(ref),
        updateDoc(doc(getFirestore(), POST_COLLECTION, postId), {
            likeCount: increment(-1),
            likeIndex: arrayRemove(_userid)
        })
    ])
}

export async function getFeeds() {
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    const firestore = getFirestore()
    const followingsSnapshot = await getDocs(collection(firestore, 'profiles', _userid, 'following'))
    const followings = followingsSnapshot.docs.map(doc => (doc.data() as ShortProfile).id)
    followings.push(_userid)
    console.log('following', followings)
    const postsSnapshot = await getDocs(
        query(collection(firestore, 'posts'),
            where('ownerId', 'in', followings),
            orderBy('datetime', 'desc'))
    )

    return postsSnapshot.docs.map(doc => doc.data() as Post)

}

export async function getCommentsCount(postId:string){
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if (!postId)
        throw new Error('No post id given for comments count');

    return (await getCountFromServer(collection(getFirestore(),'posts',postId,'comments'))).data().count
}

export async function getComments(postId: string,lastComment:UserComment,max_results:number=1) {
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if (!postId)
        throw new Error('No post id given for comments');

    const firestore = getFirestore()
    const followers: UserComment[] = []
    const commentQuery=
    lastComment?
    query(
        collection(firestore, `posts/${postId}/comments`),
        limit(max_results),
        orderBy('datetime','desc'),
        startAfter(lastComment.datetime)
    )
    :query(
        collection(firestore, `posts/${postId}/comments`),
        limit(max_results),
        orderBy('datetime','desc'),
    )
    const querySnapshot = await getDocs(commentQuery)
    querySnapshot.forEach(doc => {
        followers.push(doc.data() as UserComment)
    })
    return followers;
}

export async function addComment(postId: string, content: string): Promise<UserComment> {
    const _userid = getAuth().currentUser?.uid

    if (!_userid)
        throw new Error('No user logged in')

    if (!postId)
        throw new Error('No post id given for comments');

    const firestore = getFirestore()
    const commentId = uuid()
    const commentsRef = doc(firestore, 'posts', postId, 'comments', commentId)
    const commentObject: UserComment = {
        id: commentId,
        ownerId: _userid,
        content,
        datetime: serverTimestamp()
    }
    await setDoc(commentsRef, commentObject)
    return { ...commentObject, datetime: Date.now() };
}