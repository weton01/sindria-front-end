import { request } from "./api";

export const getUrlAssign = async () =>
  request.get({ route: `product/v1/s3/assign-url` });

export const getProductById = async ({ id, token }) =>
  request
    .get({ route: `product/v1/single/${id}`, token })
    .then((value) => value.product);

export const getProduct = async ({ params }) => {
  return request.get({ route: "product/v1", params });
};

export const getProductSuperStore = async () => {
  return request.get({ route: "product/v1/home/superstore" });
};
