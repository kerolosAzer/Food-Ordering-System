package com.FoodOrderingSystem.user_service.service;

import com.FoodOrderingSystem.user_service.dto.AuthResponse;
import com.FoodOrderingSystem.user_service.dto.LoginRequest;
import com.FoodOrderingSystem.user_service.dto.RegisterRequest;
import com.FoodOrderingSystem.user_service.entity.Role;
import com.FoodOrderingSystem.user_service.entity.User;
import com.FoodOrderingSystem.user_service.repository.UserRepository;
import com.FoodOrderingSystem.user_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
// 1. يتأكد إن الإيميل مش موجود قبل كده
// 2. يحدد role، ولو مش مبعوت يخليه CUSTOMER
// 3. يشفر الباسورد باستخدام BCrypt
// 4. يحفظ المستخدم في الداتابيز
// 5. يعمل JWT token
// 6. يرجع AuthResponse
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = request.getRole();
        if (role == null) {
            role = Role.CUSTOMER;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                token,
                "User registered successfully"
        );
    }
// 1. يدور على المستخدم بالإيميل
// 2. يقارن الباسورد المدخل بالباسورد المشفر
// 3. لو صح يعمل JWT token جديد
// 4. يرجع AuthResponse
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token,
                "Login successful"
        );
    }
}