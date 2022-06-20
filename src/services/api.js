import axios from "axios";
import { store } from "store";
import { toast } from "react-nextjs-toast";

export const PROD_URL =
  "https://92yiuy5790.execute-api.us-east-1.amazonaws.com/production/";

export const api = axios.create({
  baseURL: PROD_URL,
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

export const post = async ({
  route,
  payload,
  message = "Criado com sucesso!",
  actionSuccess = () => null,
  actionError = () => null,
}) => {
  try {
    const { data } = await api.post(route, payload);
    toast.notify(message, {
      title: "Sucesso!",
      duration: 5,
      type: "success",
    });
    actionSuccess();
    return data;
  } catch (err) {
    const error = Array.isArray(err?.response?.data?.message)
      ? err?.response?.data?.message[0]
      : err?.response?.data?.message || "Erro inesperado!";
    toast.notify(error, {
      title: "Erro!",
      duration: 5,
      type: "error",
    });
    actionError();
    return error;
  }
};

export const patch = async ({
  route,
  payload,
  message = "Alterado com sucesso!",
  actionSuccess = () => null,
  actionError = () => null,
}) => {
  try {
    const { data } = await api.patch(route, payload);
    toast.notify(message, {
      title: "Sucesso!",
      duration: 5,
      type: "success",
    });
    actionSuccess();
    return data;
  } catch (err) {
    const error = Array.isArray(err?.response?.data?.message)
      ? err?.response?.data?.message[0]
      : err?.response?.data?.message || "Erro inesperado!";

    toast.notify(error, {
      title: "Erro!",
      duration: 5,
      type: "error",
    });

    return error;
  }
};

export const put = async ({
  route,
  payload,
  config = {},
  message = "Alterado com sucesso!",
  actionSuccess = () => null,
  actionError = () => null,
}) => {
  try {
    const { data } = await api.put(route, payload, config);
    toast.notify(message, {
      title: "Sucesso!",
      duration: 5,
      type: "success",
    });
    actionSuccess();
    return data;
  } catch (err) {
    const error = Array.isArray(err?.response?.data?.message)
      ? err?.response?.data?.message[0]
      : err?.response?.data?.message || "Erro inesperado!";

    toast.notify(error, {
      title: "Erro!",
      duration: 5,
      type: "error",
    });

    actionError();
    return error;
  }
};

export const get = async ({ route, params = {} }) => {
  try {
    const { data } = await api.get(route, {
      params: params,
    }); 
    return data;
  } catch (err) {
    const error = Array.isArray(err?.response?.data?.message)
      ? err?.response?.data?.message[0]
      : err?.response?.data?.message || "Erro inesperado!";

    toast.notify(error, {
      title: "Erro!",
      duration: 5,
      type: "error",
    });

    return error;
  }
};

export const remove = async ({
  route,
  message = "Deletado com sucesso!",
  actionSuccess = () => null,
  actionError = () => null,
}) => {
  try {
    const { data } = await api.delete(route);
    toast.notify(message, {
      title: "Sucesso!",
      duration: 5,
      type: "success",
    });
    actionSuccess();
    return data;
  } catch (err) {
    const error = Array.isArray(err?.response?.data?.message)
      ? err?.response?.data?.message[0]
      : err?.response?.data?.message || "Erro inesperado!";

    toast.notify(error, {
      title: "Erro!",
      duration: 5,
      type: "error",
    });

    actionError();
    return error;
  }
};
