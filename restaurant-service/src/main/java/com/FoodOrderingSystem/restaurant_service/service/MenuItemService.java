package com.FoodOrderingSystem.restaurant_service.service;

import com.FoodOrderingSystem.restaurant_service.entity.MenuItem;
import com.FoodOrderingSystem.restaurant_service.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public MenuItem addMenuItem(@NonNull MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> getMenuItemsByRestaurantId(Long restaurantId) {
        return menuItemRepository.findByRestaurant_Id(restaurantId);
    }

    public MenuItem getMenuItemById(@NonNull Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }

    public MenuItem updateMenuItem(@NonNull Long id, @NonNull MenuItem updatedMenuItem) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        existingMenuItem.setName(updatedMenuItem.getName());
        existingMenuItem.setDescription(updatedMenuItem.getDescription());
        existingMenuItem.setPrice(updatedMenuItem.getPrice());
        existingMenuItem.setImageUrl(updatedMenuItem.getImageUrl());

        if (updatedMenuItem.getRestaurant() != null) {
            existingMenuItem.setRestaurant(updatedMenuItem.getRestaurant());
        }

        return menuItemRepository.save(existingMenuItem);
    }

    public void deleteMenuItem(@NonNull Long id) {
        menuItemRepository.deleteById(id);
    }
}