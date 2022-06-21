import axios from "axios";
import { store } from "store";
import { toast } from "react-nextjs-toast";

export const client_api = {};
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

  client_api.post = async ({
    route,
    payload,
    message = "Criado com sucesso!",
    actionSuccess = (params) => null,
    actionError = (params) => null,
  }) => {
    try {
      const { data } = await api.post(route, payload);

      toast.notify(message, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      actionSuccess(data);

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

  client_api.patch = async ({
    route,
    payload,
    message = "Alterado com sucesso!",
    actionSuccess = (params) => null,
    actionError = (params) => null,
  }) => {
    try {
      const { data } = await api.patch(route, payload);

      toast.notify(message, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      actionSuccess(data);

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

  client_api.put = async ({
    route,
    payload,
    config = {},
    message = "Alterado com sucesso!",
    actionSuccess = (params) => null,
    actionError = (params) => null,
  }) => {
    try {
      const { data } = await api.put(route, payload, config);

      toast.notify(message, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      actionSuccess(data);

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

  client_api.get = async ({ route, params = {} }) => {
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

  client_api.remove = async ({
    route,
    message = "Deletado com sucesso!",
    actionSuccess = (params) => null,
    actionError = (params) => null,
  }) => {
    try {
      const { data } = await api.delete(route);
      toast.notify(message, {
        title: "Sucesso!",
        duration: 5,
        type: "success",
      });
      actionSuccess(data);

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
}
