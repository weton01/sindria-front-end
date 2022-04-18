import axios from "axios"; 
import {store} from 'store'

export const api = axios.create({
  baseURL: "https://92yiuy5790.execute-api.us-east-1.amazonaws.com/production/",
});

if (typeof window !== "undefined") {
  const Config = (config) => {
    const token = localStorage.getItem("shop_token");
    const end_date = new Date(localStorage.getItem("shop_end_date"));
    
    if(end_date.getTime() < new Date().getTime())
      store.dispatch({type:"USER_LOGOUT"})

    if (token) 
      config.headers.Authorization = "Bearer " + token;
    
    return config;
  };

  api.interceptors.request.use(Config);
}
