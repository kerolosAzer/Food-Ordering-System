package com.FoodOrderingSystem.restaurant_service.service;

import com.FoodOrderingSystem.restaurant_service.entity.MenuItem;
import com.FoodOrderingSystem.restaurant_service.entity.Restaurant;
import com.FoodOrderingSystem.restaurant_service.repository.MenuItemRepository;
import com.FoodOrderingSystem.restaurant_service.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    // إضافة طبق جديد للمطعم
    @SuppressWarnings("null")
    public MenuItem addMenuItem(@NonNull MenuItem menuItem) {

        // لازم الـ request يبعت restaurant object وفيه id
        if (menuItem.getRestaurant() == null || menuItem.getRestaurant().getId() == null) {
            throw new RuntimeException("Restaurant id is required");
        }

        // نجيب المطعم الحقيقي من الداتابيز
        Restaurant restaurant = restaurantRepository.findById(menuItem.getRestaurant().getId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // نربط الطبق بالمطعم الحقيقي
        menuItem.setRestaurant(restaurant);

        // نحفظ الطبق
        return menuItemRepository.save(menuItem);
    }

    // الحصول على قائمة الأطباق لمطعم معين
    public List<MenuItem> getMenuItemsByRestaurantId(Long restaurantId) {
        return menuItemRepository.findByRestaurant_Id(restaurantId);
    }

    // حذف طبق حسب ID
    public void deleteMenuItem(@NonNull Long id) {
        menuItemRepository.deleteById(id);
    }

    // جلب طبق واحد حسب ID
    public MenuItem getMenuItemById(@NonNull Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }
}