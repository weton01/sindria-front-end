import { client_api } from "./api";
import { server_api } from "./server-api";

export const getUrlAssign = async () =>
  client_api.get({ route: `product/v1/s3/assign-url` });

export const getProductById = async ({ id, token }) => {
  return server_api
    .get({ route: `product/v1/creation/${id}`, token })
    .then((value) => {
      return {
        ...value,
        variations:
          value?.variations?.map((item) => ({
            ...item,
            loading: { create: false, delete: false },
            image: [item.image],
          })) || [],
      }; 
    });
};

export const getProduct = async ({ params, token }) => {
  return server_api.get({ route: `product/v1/`, params, token });
};
