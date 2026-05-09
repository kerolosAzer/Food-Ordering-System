import axiosInstance from "./axiosInstance";

export const assignDelivery = async (deliveryData) => {
  const response = await axiosInstance.post(
    "/delivery-service/api/deliveries/assign",
    deliveryData
  );
  return response.data;
};

export const getAllDeliveries = async () => {
  const response = await axiosInstance.get("/delivery-service/api/deliveries");
  return response.data;
};

export const getDeliveryById = async (deliveryId) => {
  const response = await axiosInstance.get(
    `/delivery-service/api/deliveries/${deliveryId}`
  );
  return response.data;
};

export const getDeliveryByOrderId = async (orderId) => {
  const response = await axiosInstance.get(
    `/delivery-service/api/deliveries/order/${orderId}`
  );
  return response.data;
};

export const getDeliveriesByDeliveryUserId = async (deliveryUserId) => {
  const response = await axiosInstance.get(
    `/delivery-service/api/deliveries/user/${deliveryUserId}`
  );
  return response.data;
};

export const getDeliveriesByStatus = async (status) => {
  const response = await axiosInstance.get(
    `/delivery-service/api/deliveries/status/${status}`
  );
  return response.data;
};

export const updateDeliveryStatus = async (deliveryId, deliveryStatus) => {
  const response = await axiosInstance.put(
    `/delivery-service/api/deliveries/${deliveryId}/status`,
    {
      deliveryStatus,
    }
  );
  return response.data;
};