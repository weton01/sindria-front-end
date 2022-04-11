import axios from "axios";

export const api = axios.create({
  baseURL: "https://92yiuy5790.execute-api.us-east-1.amazonaws.com/production/",
});

if (typeof window !== "undefined") {
  const Config = (config) => {
    const token = localStorage.getItem("shop_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  };

  api.interceptors.request.use(Config);
}
