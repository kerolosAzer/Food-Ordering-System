import axiosInstance from "./axiosInstance";

export const getAllRestaurants = async () => {
  const response = await axiosInstance.get(
    "/restaurant-service/api/restaurants/all"
  );
  return response.data;
};

export const getMenuByRestaurantId = async (restaurantId) => {
  const response = await axiosInstance.get(
    `/restaurant-service/api/menu/restaurant/${restaurantId}`
  );
  return response.data;
};

export const addRestaurant = async (restaurantData) => {
  const response = await axiosInstance.post(
    "/restaurant-service/api/restaurants/add",
    restaurantData
  );
  return response.data;
};

export const updateRestaurant = async (restaurantId, restaurantData) => {
  const response = await axiosInstance.put(
    `/restaurant-service/api/restaurants/${restaurantId}`,
    restaurantData
  );
  return response.data;
};

export const deleteRestaurant = async (restaurantId) => {
  const response = await axiosInstance.delete(
    `/restaurant-service/api/restaurants/${restaurantId}`
  );
  return response.data;
};

export const addMenuItem = async (menuItemData) => {
  const response = await axiosInstance.post(
    "/restaurant-service/api/menu/add",
    menuItemData
  );
  return response.data;
};

export const updateMenuItem = async (menuItemId, menuItemData) => {
  const response = await axiosInstance.put(
    `/restaurant-service/api/menu/${menuItemId}`,
    menuItemData
  );
  return response.data;
};

export const deleteMenuItem = async (menuItemId) => {
  const response = await axiosInstance.delete(
    `/restaurant-service/api/menu/${menuItemId}`
  );
  return response.data;
};