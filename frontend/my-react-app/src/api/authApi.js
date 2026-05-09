import axiosInstance from "./axiosInstance";

export const register = async (userData) => {
  const response = await axiosInstance.post("/user-service/api/auth/register", userData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/user-service/api/auth/login", loginData);
  return response.data;
};