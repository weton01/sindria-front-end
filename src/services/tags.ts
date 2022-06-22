import { request } from "./api";

export const getTags = async () =>
  request.get({ route: `tag/v1/`, params: { take: 10000, skip: 0 } });
