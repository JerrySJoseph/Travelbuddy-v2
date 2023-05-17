type StringValidator=(input:string,...args:any[])=>boolean|any

export const bioValidator:StringValidator=(input:string)=>{
    if(input.length>200)
        throw new Error('Your bio is too large. [max characters:200]')
        
}

export const NotEmptyStringValidator:StringValidator=(input:string,max:number=20)=>{
    if(input.length>max || input.length===0)
        throw new Error('Invalid input')
}