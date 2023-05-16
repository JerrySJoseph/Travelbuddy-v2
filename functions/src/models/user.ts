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
    followersCount:number,
    followedCount:number,
    [key:string]:any
}

export interface ShortProfile{
    type:'short-profile',
    id:string,
    firstname:string,
    lastname:string,
    username:string,
    avatar:string,
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

export interface Like{
    id:string,
    owner:ShortProfile,
    datetime:any
}

export interface Dislike{
    id:string,
    owner:ShortProfile,
    datetime:any
}

export interface Destination{
    type:'destination',
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
}

export interface Notification{
    type:'notification',
    id:string,
    notificationType:string,
    title:string,
    content:string,
    seen:boolean,
    datetime:any
}

export interface TravelPlanInvite{
    type:'travel-plan-invite',
    id:string,
    owner:UserProfile,
    travelPlan:TravelPlan,
    datetime:any,
    recipient:UserProfile,
    status:'PENDING'|'ACCEPTED'|'REJECTED',
    respondDatetime?:any
}


export interface FollowRequest{
    id:string,
    owner:ShortProfile,
    recipient:ShortProfile,
    ownerId:string,
    recipientId:string
    datetime:any
    status:'PENDING'|'ACCEPTED'|"REJECTED"
}

export interface Relationship{
    followerId:string,
    followedId:string,
    follower:ShortProfile,
    followed:ShortProfile
    datetime:any
}

export type MediaType='Image'|'Video'|'TravelPlan'

export interface Media{
    mediaType:MediaType,
    mediaUrl:string,
    ownerId:string,
}

export interface Post{
    id:string,
    text:string,
    ownerId:string,
    owner:ShortProfile,
    medias:Media[],
    datetime:any,
    likes:Like[]
    dislikes:Dislike[],
    comment:UserComment[]
}

export interface UserComment{
    id:string,
    owner:ShortProfile,
    content:string,
    datetime:any
}