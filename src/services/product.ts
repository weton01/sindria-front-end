import { request } from "./api";

export const getUrlAssign = async () =>
  request.get({ route: `product/v1/s3/assign-url` });

export const getProductById = async ({ id, token }) =>
  request.get({ route: `product/v1/single/${id}`, token }).then((value)=>  value.product)

export const getVariationById = async ({ id, token }) => {
  return request
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

export const getProduct = async ({ params }) => {
  return request.get({ route: "product/v1", params });
};

export const getProductSuperStore = async () => {
  return request.get({ route: "product/v1/home/superstore" });
};
