package com.FoodOrderingSystem.restaurant_service.controller;

import com.FoodOrderingSystem.restaurant_service.entity.MenuItem;
import com.FoodOrderingSystem.restaurant_service.service.MenuItemService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    // إضافة طبق جديد للمطعم
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public MenuItem addMenuItem(@RequestBody @NonNull MenuItem menuItem) {

        // تحقق أن الـ restaurantId موجود في الـ request
        if (menuItem.getRestaurantId() == null) {
            throw new RuntimeException("Restaurant ID is required");
        }

        return menuItemService.addMenuItem(menuItem);
    }

    // جلب طبق واحد بالـ id عشان order-service يعرف السعر الحقيقي
    @GetMapping("/{id}")
    public MenuItem getMenuItemById(@PathVariable @NonNull Long id) {
        return menuItemService.getMenuItemById(id);
    }

    // عرض منيو مطعم كامل حسب restaurantId (مفتوح للجميع)
    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuItemsByRestaurantId(@PathVariable @NonNull Long restaurantId) {
        return menuItemService.getMenuItemsByRestaurantId(restaurantId);
    }

    // حذف طبق حسب ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMenuItem(@PathVariable @NonNull Long id) {
        menuItemService.deleteMenuItem(id);
    }
}