package com.FoodOrderingSystem.user_service.service;

import com.FoodOrderingSystem.user_service.dto.ChangePasswordRequest;
import com.FoodOrderingSystem.user_service.dto.RegisterRequest;
import com.FoodOrderingSystem.user_service.dto.UpdateProfileRequest;
import com.FoodOrderingSystem.user_service.dto.UserResponse;
import com.FoodOrderingSystem.user_service.entity.User;
import com.FoodOrderingSystem.user_service.entity.Role;
import com.FoodOrderingSystem.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // إرجاع بيانات المستخدم بناءً على الإيميل
    public UserResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    // تحديث بيانات المستخدم بناءً على الإيميل
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        @SuppressWarnings("null")
        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }

    // تغيير كلمة المرور للمستخدم
    public String changePassword(String email, ChangePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // التحقق من صحة كلمة المرور القديمة
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // تغيير كلمة المرور إلى الجديدة
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }

    // إرجاع جميع المستخدمين (يقتصر على الأدمن فقط)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    // إرجاع مستخدم بناءً على ID (يقتصر على الأدمن فقط)
    public UserResponse getUserById(@NonNull Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    // حذف مستخدم بناءً على ID (يقتصر على الأدمن فقط)
    public String deleteUser(@NonNull Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);

        return "User deleted successfully";
    }

    // طريقة لإضافة مستخدم جديد
    public UserResponse addUser(RegisterRequest request) {

        // تأكد إن الإيميل مش موجود قبل كده
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // تعيين Role المستخدم
        Role role = request.getRole();
        if (role == null) {
            role = Role.CUSTOMER; // لو مش موجود role، خليها Customer
        }

        // إنشاء كائن المستخدم الجديد
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(role);

        // حفظ المستخدم في الداتابيز
        User savedUser = userRepository.save(user);

        // إرجاع الرد
        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getAddress(),
                savedUser.getRole()
        );
    }

    // تحويل كائن User إلى UserResponse لتسليمه في الـ API Response
    private UserResponse mapToUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRole()
        );
    }
}