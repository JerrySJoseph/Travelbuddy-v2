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

export interface Destination{
    id:string,
    name:string,
    city:string,
    country:string,
    attractions:string[],
    reviews:UserReview[]
}

export interface UserReview{
    owner:UserProfile,
    rating:number,
    comment:string,
    verified:Boolean,
    datetime:number
}

export interface TravelGroup{
    id:string,
    name:string,
    createdBy:UserProfile,
    slots:number,
    members:UserProfile[],
    travellingDateRange:{
        start:number,
        end:number,
        flexibility:number
    },
    summary:string
}