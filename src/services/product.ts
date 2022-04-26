import { get } from "./api";

export const getUrlAssign = async () => get(`product/v1/s3/assign-url`);
