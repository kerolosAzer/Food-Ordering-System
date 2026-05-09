package com.FoodOrderingSystem.user_service.dto;

import com.FoodOrderingSystem.user_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private String token;

    private String message;
}
