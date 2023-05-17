export const URL_DEFAULT_AVATAR='https://d11b3pf7ulbs6a.cloudfront.net/static/img/panda.png'
export const REF_POSTS_ROOT='posts'

export const getPostRef=(userId:string)=>{
    return `${REF_POSTS_ROOT}/${userId}/`
}