import { uniqueId } from "lodash";
import { WorkExperience } from "../data/models/user";

export default function generateDummyWorkExperience():WorkExperience{
    return {
        id:'workexp_'+uniqueId(),
        jobtitle:'',
        company:'',
        termstart:2000,
        termend:new Date().getFullYear(),
        responsibilities:[ ]
    }
}