import { PROD_URL } from "services/api";
import axios from "axios";

export const server_api = {
  get: async ({ route, params = {}, token, headers = {} }) => {
    try {
      const { data } = await axios.get(`${PROD_URL}${route}`, {
        params,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (err) {
      return err?.response;
    }
  },
};
