export function validateState(stateVar:any,setErrorFn:(msg:string,field:string)=>any,check:(arg: any)=>Boolean,errorMessage:string):Boolean{
    if (!check(stateVar))
        setErrorFn(errorMessage,'')
    return check(stateVar)
}