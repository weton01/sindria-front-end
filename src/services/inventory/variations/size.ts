import { request } from "services/api";

export const getSizeById = async ({ id, token }) => {
    return request
      .get({ route: `product/v1/creation/${id}`, token })
      .then((value) => {
        return {
          ...value,
          sizes:
            value?.variations
              ?.map((item) => ({
                ...item,
                loading: { create: false, delete: false },
                image: [item.image],
              }))
              .filter((i) => i.type === "size") || [],
        };
      });
  };
  