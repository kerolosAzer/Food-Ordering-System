package com.FoodOrderingSystem.restaurant_service.controller;

import com.FoodOrderingSystem.restaurant_service.entity.MenuItem;
import com.FoodOrderingSystem.restaurant_service.service.MenuItemService;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    // إضافة طبق جديد للمطعم
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public MenuItem addMenuItem(@RequestBody @NonNull MenuItem menuItem) {
        return menuItemService.addMenuItem(menuItem);
    }

    // جلب طبق واحد بالـ id عشان order-service يعرف السعر الحقيقي
    @GetMapping("/{id}")
    public MenuItem getMenuItemById(@PathVariable @NonNull Long id) {
        return menuItemService.getMenuItemById(id);
    }

    // جلب منيو مطعم معين
    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuItemsByRestaurantId(@PathVariable Long restaurantId) {
        return menuItemService.getMenuItemsByRestaurantId(restaurantId);
    }

    // تحديث طبق
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MenuItem updateMenuItem(
            @PathVariable @NonNull Long id,
            @RequestBody @NonNull MenuItem menuItem
    ) {
        return menuItemService.updateMenuItem(id, menuItem);
    }

    // حذف طبق حسب ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMenuItem(@PathVariable @NonNull Long id) {
        menuItemService.deleteMenuItem(id);
    }
}