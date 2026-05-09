import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/user-service/api/users/all");
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axiosInstance.put(
    `/user-service/api/users/${userId}`,
    userData
  );
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(
    `/user-service/api/users/${userId}`
  );
  return response.data;
};