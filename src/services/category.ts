import { server_api } from "./server-api";

export const getCategory = async (token) =>
  server_api.get({ route: `category/v1/`, token });

export const getSubCategory = async (token) =>
  server_api.get({
    route: `category/v1/sub-category?take=10000&skip=0`,
    token,
  });
