import axiosInstance from "./axiosInstance";

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post(
    "/order-service/api/orders",
    orderData
  );
  return response.data;
};

export const getOrdersByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(
    `/order-service/api/orders/customer/${customerId}`
  );
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axiosInstance.get("/order-service/api/orders");
  return response.data;
};

export const getOrdersByRestaurantId = async (restaurantId) => {
  const response = await axiosInstance.get(
    `/order-service/api/orders/restaurant/${restaurantId}`
  );
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(
    `/order-service/api/orders/${orderId}/status`,
    {
      status: status,
    }
  );
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await axiosInstance.put(
    `/order-service/api/orders/${orderId}/cancel`
  );
  return response.data;
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  const response = await axiosInstance.put(
    `/order-service/api/orders/${orderId}/payment-status`,
    {
      paymentStatus: paymentStatus,
    }
  );
  return response.data;
};