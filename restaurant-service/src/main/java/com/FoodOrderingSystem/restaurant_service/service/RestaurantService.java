package com.FoodOrderingSystem.restaurant_service.service;

import com.FoodOrderingSystem.restaurant_service.entity.Restaurant;
import com.FoodOrderingSystem.restaurant_service.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public Restaurant addRestaurant(@NonNull Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(@NonNull Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant updateRestaurant(@NonNull Long id, @NonNull Restaurant updatedRestaurant) {
        Restaurant existingRestaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        existingRestaurant.setName(updatedRestaurant.getName());
        existingRestaurant.setAddress(updatedRestaurant.getAddress());
        existingRestaurant.setPhone(updatedRestaurant.getPhone());

        // مهم جدًا لتحديث الصورة
        existingRestaurant.setImageUrl(updatedRestaurant.getImageUrl());

        return restaurantRepository.save(existingRestaurant);
    }

    public void deleteRestaurant(@NonNull Long id) {
        restaurantRepository.deleteById(id);
    }
}