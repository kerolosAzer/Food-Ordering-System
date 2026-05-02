package com.FoodOrderingSystem.restaurant_service.controller;

import com.FoodOrderingSystem.restaurant_service.entity.Restaurant;
import com.FoodOrderingSystem.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // إضافة مطعم جديد (فقط الأدمن يمكنه إضافة المطعم)
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public Restaurant addRestaurant(@RequestBody @NonNull Restaurant restaurant) {
        return restaurantService.addRestaurant(restaurant);
    }

    // الحصول على جميع المطاعم (يمكن للجميع الوصول إليها)
    @GetMapping("/all")
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // حذف مطعم حسب الـ ID (فقط الأدمن يمكنه حذف المطعم)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRestaurant(@PathVariable @NonNull Long id) {
        restaurantService.deleteRestaurant(id);
    }
}