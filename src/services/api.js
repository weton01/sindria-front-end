import axios from "axios";
import { toast } from "react-nextjs-toast";

export const request = {};
export const PROD_URL =
  "https://hixylbo4ji.execute-api.us-east-1.amazonaws.com/production/";
export const api = axios.create({
  baseURL: PROD_URL,
});

if (typeof window !== "undefined") {
  // Request Client Side //

  const Config = (config) => {
    const token = localStorage.getItem("shop_token");
    const end_date = new Date(localStorage.getItem("shop_end_date"));

    if (end_date.getTime() < new Date().getTime())
      if (token) config.headers.Authorization = "Bearer " + token;

    return config;
  };

  api.interceptors.request.use(Config);

  request.post = async ({
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

      if (actionError(err) === null) {
        toast.notify(error, {
          title: "Erro!",
          duration: 5,
          type: "error",
        });
      }

      return error;
    }
  };

  request.patch = async ({
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

      if (actionError(err) === null) {
        toast.notify(error, {
          title: "Erro!",
          duration: 5,
          type: "error",
        });
      }

      return error;
    }
  };

  request.put = async ({
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

      if (actionError(err) === null) {
        toast.notify(error, {
          title: "Erro!",
          duration: 5,
          type: "error",
        });
      }
      return error;
    }
  };

  request.get = async ({ route, params = {}, token = "", headers = {} }) => {
    try {
      const { data } = await api.get(route, {
        params: params,
      });

      return data;
    } catch (err) {
      const error = Array.isArray(err?.response?.data?.message)
        ? err?.response?.data?.message[0]
        : err?.response?.data?.message || "Erro inesperado!";

      if (actionError(err) === null) {
        toast.notify(error, {
          title: "Erro!",
          duration: 5,
          type: "error",
        });
      }

      return error;
    }
  };

  request.remove = async ({
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

      if (actionError(err) === null) {
        toast.notify(error, {
          title: "Erro!",
          duration: 5,
          type: "error",
        });
      }
      return error;
    }
  };
} else {
  // Request Server Side //

  request.get = async ({
    route,
    params = {},
    token = undefined,
    headers = {},
  }) => {
    try {
      if (token) headers["Authorization"] = "Bearer " + token;

      const { data } = await axios.get(`${PROD_URL}${route}`, {
        params,
        headers: headers,
      });
      return data;
    } catch (err) {
      err?.response;
    }
  };
}
