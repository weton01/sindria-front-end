import { request } from "./api";

export const getAddress = ({ token, skip, take }) => 
  request.get({
    route: `address/v1`,
    params: { skip, take },
    token,
  });
