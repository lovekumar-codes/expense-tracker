
import API from "../api/axios";

export const loginUser = (data:any)=>{
    return API.post("/auth/login",data)
};

export const registerUser = (data:any) =>{
    return API.post("/auth/register",data);
};