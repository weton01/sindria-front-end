import { request } from "./api";

export const getStore = ({ token, skip, take }) =>
  request.get({
    route: `store/v1`,
    params: { skip, take },
    token,
  });

export const getStoreById = ({ token, id }) =>
  request.get({
    route: `store/v1/${id}`,
    params: {
      relations: ["address"],
    },
    token,
  });
