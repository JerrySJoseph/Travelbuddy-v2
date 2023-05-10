export interface UserProfile{
    type:'user-profile',
    id:string,
    firstname:string,
    lastname:string,
    email:string,
    bio:string,
    avatar:string,
    travelPlans:TravelPlan[],
    username:string,
    rating:number,
    reviews:UserReview[]
    followersCount:number,
    followedCount:number,
    [key:string]:any
}

export interface UserProfileOverride{
    id?:string,
    firstname?:string,
    lastname?:string,
    email?:string,
    bio?:string,
    avatar?:string,
    travelPlans?:TravelPlan[]
}

export interface Likes{
    id:string,
    owner:UserProfile,
    datetime:any
}

export interface Dislikes{
    id:string,
    owner:UserProfile,
    datetime:any
}

export interface Destination{
    type:'destination',
    id:string,
    name:string,
    city:string,
    country:string,
    attractions:string[],
    rating:number,
    reviews:UserReview[]
}

export interface DestinationOverride{
    id?:string,
    name?:string,
    city?:string,
    country?:string,
    attractions?:string[],
    reviews?:UserReview[],
    rating?:number,
    
}

export interface UserReview{
    type:'user-review',
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
    type:'travel-group',
    id:string,
    name:string,
    createdBy?:UserProfile,
    members:UserProfile[],
    rating?:number,
    reviews?:UserReview[]
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
    rating?:number,
    reviews?:UserReview[]
}

export interface TravelPlan{
    type:'travel-plan',
    id:string,
    createdBy?:UserProfile
    destinations:Destination[]
    group:TravelGroup,
    inviteMembers:UserProfile[]
    isPrivate:Boolean,
    travellingDateRange:{
        start:number,
        end:number,
        flexibility:number
    },
    summary:string,
    interestedMembers?:UserProfile[]
}

export interface TravelPlanOverride{
    id?:string,
    createdBy?:UserProfile
    destinations?:Destination[]
    group?:TravelGroup,
    isPrivate?:Boolean,
    inviteMembers?:UserProfile[]
    travellingDateRange?:{
        start?:number,
        end?:number,
        flexibility?:number
    },
    summary?:string,
    interestedMembers?:UserProfile[]
}

export interface Notification{
    type:'notification',
    id:string,
    notificationType:string,
    title:string,
    content:string,
    datetime:any
}

export interface TravelPlanInvite{
    type:'travel-plan-invite',
    id:string,
    owner:UserProfile,
    travelPlan:TravelPlan,
    datetime:any,
    recipient:UserProfile,
    status:'PENDING'|'ACCEPTED'|'REJECTED'
}