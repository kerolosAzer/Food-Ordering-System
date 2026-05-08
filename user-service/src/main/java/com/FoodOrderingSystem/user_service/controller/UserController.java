package com.FoodOrderingSystem.user_service.controller;

import com.FoodOrderingSystem.user_service.dto.ChangePasswordRequest;
import com.FoodOrderingSystem.user_service.dto.RegisterRequest;
import com.FoodOrderingSystem.user_service.dto.UpdateProfileRequest;
import com.FoodOrderingSystem.user_service.dto.UserResponse;
import com.FoodOrderingSystem.user_service.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // الحصول على بيانات المستخدم الحالي
    @GetMapping("/profile")
    public UserResponse profile(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }

    // تحديث بيانات المستخدم الحالي
    @PutMapping("/profile")
    public UserResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfile(authentication.getName(), request);
    }

    // تغيير كلمة المرور للمستخدم الحالي
    @PutMapping("/change-password")
    public Map<String, String> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {
        String message = userService.changePassword(authentication.getName(), request);
        return Map.of("message", message);
    }

    // الحصول على جميع المستخدمين للأدمن فقط
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // الحصول على مستخدم حسب ID للأدمن فقط
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUserById(@PathVariable @NonNull Long id) {
        return userService.getUserById(id);
    }

    // تعديل مستخدم بواسطة الأدمن
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUserByAdmin(
            @PathVariable @NonNull Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateUserByAdmin(id, request);
    }

    // حذف مستخدم بواسطة الأدمن
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> deleteUser(@PathVariable @NonNull Long id) {
        String message = userService.deleteUser(id);
        return Map.of("message", message);
    }

    // إضافة مستخدم جديد بواسطة الأدمن
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse addUser(@RequestBody RegisterRequest request) {
        return userService.addUser(request);
    }
}