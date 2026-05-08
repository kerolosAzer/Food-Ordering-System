import axiosInstance from "./axiosInstance";

export const getLatestLogs = async () => {
  const response = await axiosInstance.get("/delivery-service/api/logs");
  return response.data;
};

export const getLogsByStatus = async (status) => {
  const response = await axiosInstance.get(
    `/delivery-service/api/logs/status/${status}`
  );
  return response.data;
};

export const getLogsByActionType = async (actionType) => {
  const response = await axiosInstance.get(
    `/delivery-service/api/logs/action/${actionType}`
  );
  return response.data;
};