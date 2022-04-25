import { get } from "./api";

export const getTags = async () => get(`tag/v1/`, { take: 10000, skip: 0 });
