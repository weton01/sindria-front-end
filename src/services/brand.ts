import { get } from "./api";

export const getBrands = () => get(`brand/v1/`, {skip:0, take: 100000});
