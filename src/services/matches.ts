import { request } from "./api";

export const getMatches = ({ token }) => 
  request.get({
    route: `auth/v1/matches`, 
    token,
  });
