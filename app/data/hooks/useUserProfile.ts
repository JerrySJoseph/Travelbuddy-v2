import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

export const useUserProfile = ()=>useContext(AuthContext)