import { request } from "./api";

export const getPaymentById = async (id) =>
  request.get({ route: `payment/v1/${id}` });