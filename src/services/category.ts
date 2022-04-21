import { get } from "./api";

export const getCategory = async () => get(`category/v1/`);