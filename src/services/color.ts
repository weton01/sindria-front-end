import { patch, post, remove } from "./api";

export const postColors = async (id, payload) =>
  post(`inventory/v1/colors/default/${id}`, payload);

export const patchColors = async (id, payload) =>
  patch(`inventory/v1/colors/default/${id}`, payload);

export const removeColors = async (id) =>
  remove(`inventory/v1/${id}`);
