import { request } from "./api";

export const getBrands = ({ token }) =>
  request.get({
    route: `brand/v1/`,
    params: { skip: 0, take: 100000 },
    token,
  });
