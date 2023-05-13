type StringValidator=(input:string)=>boolean|any

export const bioValidator:StringValidator=(input:string)=>{
    if(input.length>200)
        throw new Error('Your bio is too large. [max characters:200]')
        
}