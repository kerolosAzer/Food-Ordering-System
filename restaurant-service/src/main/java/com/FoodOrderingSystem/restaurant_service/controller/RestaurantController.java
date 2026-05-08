package com.FoodOrderingSystem.restaurant_service.controller;

import com.FoodOrderingSystem.restaurant_service.entity.Restaurant;
import com.FoodOrderingSystem.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public Restaurant addRestaurant(@RequestBody @NonNull Restaurant restaurant) {
        return restaurantService.addRestaurant(restaurant);
    }

    @GetMapping("/all")
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable @NonNull Long id) {
        return restaurantService.getRestaurantById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Restaurant updateRestaurant(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull Restaurant restaurant
    ) {
        return restaurantService.updateRestaurant(id, restaurant);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRestaurant(@PathVariable @NonNull Long id) {
        restaurantService.deleteRestaurant(id);
    }
}