package com.FoodOrderingSystem.restaurant_service.repository;

import com.FoodOrderingSystem.restaurant_service.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByRestaurant_Id(Long restaurantId);
}