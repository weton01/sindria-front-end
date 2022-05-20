import { get } from "./api";

export const getUrlAssign = async () => get(`product/v1/s3/assign-url`);

export const getProductById = async (id: any) =>{ 
  return get(`product/v1/single/${id}`, {relations: ["tags"]}).then((value) => { 
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
}