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

export interface DestinationOverride{
    id?:string,
    name?:string,
    city?:string,
    country?:string,
    attractions?:string[],
    reviews?:UserReview[]
}

export interface UserReview{
    id:string
    owner:UserProfile,
    rating:number,
    comment:string,
    verified:Boolean,
    datetime:any
}
export interface UserReviewOverride{
    id?:string
    owner?:UserProfile,
    rating?:number,
    comment?:string,
    verified?:Boolean,
    datetime?:any
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


export interface TravelGroupOverride{
    id?:string,
    name?:string,
    createdBy?:UserProfile,
    slots?:number,
    members?:UserProfile[],
    travellingDateRange?:{
        start?:number,
        end?:number,
        flexibility?:number
    },
    summary?:string
}

export interface TravelPlan{
    id:string,
    destinations:Destination
    group:TravelGroup,
}