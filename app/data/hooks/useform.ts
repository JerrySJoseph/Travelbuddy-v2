interface UseFormProps{
    initialValue:{
        [key:string]:any
    },
    validators:{
        [key:string]:any
    }
}

interface UseFormReturnType{
    validate:()=>any,
    errors:{
        [key:string]:string
    },
    isValid:boolean,
}

const useForm=({initialValue,validators}:UseFormProps):UseFormReturnType=>{
    return {
        validate:()=>{},
        isValid:false,
        errors:{

        }
    }
}

export default useForm;