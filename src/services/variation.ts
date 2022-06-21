import { client_api } from "./api";

export const postVariation = async ({
  id,
  payload,
  actionSuccess = () => null,
}) =>
  client_api.post({
    route: `inventory/v1/variation/default/${id}`,
    payload,
    message: `Variação criada!!`,
    actionSuccess = () => null,
  });

export const patchVariation = async ({
  id,
  payload,
  actionSuccess = () => null,
}) =>
  client_api.post({
    route: `inventory/v1/variation/default/${id}`,
    payload,
    message: `Variação editada!`,
    actionSuccess = () => null,
  });

export const removeVariation = async ({ id, actionSuccess = () => null }) =>
  client_api.remove({
    route: `inventory/v1/${id}`,
    message: `Variação removida!`,
    actionSuccess = () => null,
  });
