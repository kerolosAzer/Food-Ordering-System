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

    // إضافة مطعم جديد
    public Restaurant addRestaurant(@NonNull Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    // الحصول على كل المطاعم
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    // الحصول على مطعم حسب الـ ID
    public Restaurant getRestaurantById(@NonNull Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    // حذف مطعم حسب الـ ID
    public void deleteRestaurant(@NonNull Long id) {
        restaurantRepository.deleteById(id);
    }
}