export const validateEmail = (email:string) => {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
  };

export const notEmptyValidator =(text:string)=>{
    return !!text && text.length>0
}

export const passwordValidator=(pwd:string)=>{
    return notEmptyValidator(pwd)
}