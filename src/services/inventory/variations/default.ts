import { request } from "../../api";

export const getVariationById = async ({ id, token }) => {
  return request
    .get({ route: `product/v1/creation/${id}`, token })
    .then((value) => {
      return {
        ...value,
        variations:
          value?.variations
            ?.map((item) => ({
              ...item,
              loading: { create: false, delete: false },
              image: [item.image],
            }))
            .filter((i) => i.type === "default") || [],
      };
    });
};

export const postVariation = async ({
  id,
  payload,
  actionSuccess = () => null,
}) =>
  request.post({
    route: `inventory/v1/variation/default/${id}`,
    payload,
    message: `Variação criada!!`,
    actionSuccess,
  });

export const patchVariation = async ({
  id,
  payload,
  actionSuccess = () => null,
}) =>
  request.patch({
    route: `inventory/v1/variation/default/${id}`,
    payload,
    message: `Variação editada!`,
    actionSuccess,
  });

export const removeVariation = async ({ id, actionSuccess = () => null }) =>
  request.remove({
    route: `inventory/v1/variation/${id}`,
    message: `Variação removida!`,
    actionSuccess,
  });

