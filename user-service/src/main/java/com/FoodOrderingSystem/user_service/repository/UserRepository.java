package com.FoodOrderingSystem.user_service.repository;

import com.FoodOrderingSystem.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
//  نستخدمها في (login) عشان نجيب المستخدم بالإيميل
    Optional<User> findByEmail(String email);
// نستخدمها في register عشان نمنع تكرار الإيميل
    boolean existsByEmail(String email);
}