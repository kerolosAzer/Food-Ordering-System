import axiosInstance from "./axiosInstance";

export const getReviewsByRestaurantId = async (restaurantId) => {
  const response = await axiosInstance.get(
    `/restaurant-service/api/reviews/restaurant/${restaurantId}`
  );
  return response.data;
};

export const addReview = async (reviewData) => {
  const response = await axiosInstance.post(
    "/restaurant-service/api/reviews/add",
    reviewData
  );
  return response.data;
};