import { request } from "services/api";

export const postColor = async ({
  id,
  payload,
  actionSuccess = () => null,
}) =>
  request.post({
    route: `inventory/v1/variation/color/${id}`,
    payload,
    message: `Variação criada!!`,
    actionSuccess,
  });

export const patchColor = async ({
  id,
  payload,
  actionSuccess = () => null,
}) =>
  request.patch({
    route: `inventory/v1/variation/color/${id}`,
    payload,
    message: `Variação editada!`,
    actionSuccess,
  });

export const removeColor = async ({ id, actionSuccess = () => null }) =>
  request.remove({
    route: `inventory/v1/variation/${id}`,
    message: `Variação removida!`,
    actionSuccess,
  });

export const getColorById = async ({ id, token }) => {
  return request
    .get({ route: `product/v1/creation/${id}`, token })
    .then((value) => {
      return {
        ...value,
        colors:
          value?.colors
            ?.map((item) => ({
              ...item,
              loading: { create: false, delete: false },
              image: [item.image],
            }))
            .filter((i) => i.type === "color") || [],
      };
    });
};
