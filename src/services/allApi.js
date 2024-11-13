import {BASE_URL} from './baseUrl';
import { commonAPI } from './commonApi';

export const registerAPI = async (data)=>{
    return await commonAPI('POST', `${BASE_URL}/register`, data,"");
}

export const loginAPI = async (data)=>{
    return await commonAPI('POST', `${BASE_URL}/login`, data,"");
}

export const logoutAPI = async(header)=>{
    return await commonAPI('POST', `${BASE_URL}/logout`, {},header);
}