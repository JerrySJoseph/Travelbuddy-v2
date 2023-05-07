import { Destination } from 'data/models/user'
import { getDatabase, get, ref,query, orderByChild, startAt, limitToFirst } from 'firebase/database'

export const getDestinations = async (searchString:string='',limit:number=10) => {
    const db = getDatabase()
    const node = ref(db, 'destinations/data');
    const dbQuery=query(node,orderByChild('name'),startAt(searchString),limitToFirst(limit))
    const dbSnapshot = await get(node)
    const destinations: Destination[] = []
    dbSnapshot.forEach(dest => {
        destinations.push(dest.val() as Destination)
    })
    console.log(destinations)
    return destinations
}