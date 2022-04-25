import { get } from "./api";

export const getCategory = async () => get(`category/v1/`);

export const getSubCategory = async () => get(`category/v1/sub-category?take=10000&skip=0`);