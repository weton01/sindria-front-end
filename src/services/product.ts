import { get } from "./api";

export const getUrlAssign = async () => get(`product/v1/s3/assign-url`);

export const getProductById = async (id: any) =>
  get(`product/v1/${id}`).then((value) => { 
    return {
      ...value,
      variations: value?.variations?.map((item) => {
        return {
          ...item,
          loading: { create: false, delete: false},
          image: [item.image],
        };
      }) || [],
    };
  });
