
export interface UserProfile{
    id:string,
    firstname:string,
    lastname:string,
    email:string,
    bio:string,
    avatar:string,
    [key:string]:any
}

export interface UserProfileOverride{
    id?:string,
    firstname?:string,
    lastname?:string,
    email?:string,
    bio?:string,
    avatar?:string
}
