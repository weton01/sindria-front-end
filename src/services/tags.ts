import { client_api, get } from "./api";

export const getTags = async () => client_api.get(`tag/v1/`, { take: 10000, skip: 0 });
