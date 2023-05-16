import { Media, Post, PostRaw } from "data/models/user";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { UploadTaskSnapshot, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import { getShortProfile } from "./profile";

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

        const ownerShortProfile = await getShortProfile(user.uid)
        let postObject: Post = {
            id: postId,
            ownerId: user.uid,
            owner: ownerShortProfile,
            datetime: serverTimestamp(),
            text: post.text,
        }

        const firestore = getFirestore();
        const docRef = doc(firestore, 'posts', postId)
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
    const postQuery = query(collection(firestore, 'posts')
        , where('ownerId', '==', _userid),orderBy('datetime','desc'))
    const snapshots = await getDocs(postQuery)
    snapshots.forEach(snap => {
        posts.push(
            snap.data() as Post
        )
    })
    return posts;
}