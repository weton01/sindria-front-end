import { patch, post, remove } from "./api";

export const postVariation = async (id, payload) =>
  post(`inventory/v1/variation/default/${id}`, payload);

export const patchVariation = async (id, payload) =>
  patch(`inventory/v1/variation/default/${id}`, payload);

export const removeVariation = async (id) =>
  remove(`inventory/v1/${id}`);
