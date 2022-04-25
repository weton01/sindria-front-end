import axios from "axios";
import { store } from "store";

export const api = axios.create({
  baseURL: "https://92yiuy5790.execute-api.us-east-1.amazonaws.com/production/",
});

if (typeof window !== "undefined") {
  const Config = (config) => {
    const token = localStorage.getItem("shop_token");
    const end_date = new Date(localStorage.getItem("shop_end_date"));

    if (end_date.getTime() < new Date().getTime())
      store.dispatch({ type: "USER_LOGOUT" });

    if (token) config.headers.Authorization = "Bearer " + token;

    return config;
  };

  api.interceptors.request.use(Config);
}

export const post = async (route, payload) => {
  try {
    const { data } = await api.post(route, payload);
    return data;
  } catch (err) {
    return err?.req?.body?.message || "Erro inesperado!";
  }
};

export const patch = async (route, payload) => {
  try {
    const { data } = await api.patch(route, payload);
    return data;
  } catch (err) {
    return err?.req?.body?.message || "Erro inesperado!";
  }
};

export const put = async (route, payload, config = {}) => {
  try {
    const { data } = await api.put(route, payload, config);
    return data;
  } catch (err) {
    return err?.req?.body?.message || "Erro inesperado!";
  }
};

export const get = async (route, params) => {
  try {
    const { data } = await api.get(route, {
      params: params,
    });
    return data;
  } catch (err) {
    return err?.req?.body?.message || "Erro inesperado!";
  }
};

export const remove = async (route) => {
  try {
    const { data } = await api.delete(route);
    return data;
  } catch (err) {
    return err?.req?.body?.message || "Erro inesperado!";
  }
};
