import axiosInstance from "./axiosInstance";

export const createPayment = async (paymentData) => {
  const response = await axiosInstance.post(
    "/payment-service/api/payments",
    paymentData
  );
  return response.data;
};

export const getAllPayments = async () => {
  const response = await axiosInstance.get("/payment-service/api/payments");
  return response.data;
};

export const getPaymentByOrderId = async (orderId) => {
  const response = await axiosInstance.get(
    `/payment-service/api/payments/order/${orderId}`
  );
  return response.data;
};

export const confirmPayment = async (paymentId) => {
  const response = await axiosInstance.put(
    `/payment-service/api/payments/${paymentId}/confirm`
  );
  return response.data;
};

export const failPayment = async (paymentId) => {
  const response = await axiosInstance.put(
    `/payment-service/api/payments/${paymentId}/fail`
  );
  return response.data;
};