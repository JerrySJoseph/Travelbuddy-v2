import { getDatabase, ref, remove } from "firebase/database";

export async function deleteNotification(notifId:string){
    const notificationRef=ref(getDatabase(),'notifications/'+notifId)
    await remove(notificationRef)
}