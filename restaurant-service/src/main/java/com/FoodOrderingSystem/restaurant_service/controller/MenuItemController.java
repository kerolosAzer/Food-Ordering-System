package com.FoodOrderingSystem.restaurant_service.controller;

import com.FoodOrderingSystem.restaurant_service.entity.MenuItem;
import com.FoodOrderingSystem.restaurant_service.service.MenuItemService;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @PostMapping("/add")
    public MenuItem addMenuItem(@RequestBody @NonNull MenuItem menuItem) {
        return menuItemService.addMenuItem(menuItem);
    }

    @GetMapping("/{id}")
    public MenuItem getMenuItemById(@PathVariable @NonNull Long id) {
        return menuItemService.getMenuItemById(id);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuItemsByRestaurantId(@PathVariable Long restaurantId) {
        return menuItemService.getMenuItemsByRestaurantId(restaurantId);
    }

    @PutMapping("/{id}")
    public MenuItem updateMenuItem(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull MenuItem menuItem
    ) {
        return menuItemService.updateMenuItem(id, menuItem);
    }

    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable @NonNull Long id) {
        menuItemService.deleteMenuItem(id);
    }
}