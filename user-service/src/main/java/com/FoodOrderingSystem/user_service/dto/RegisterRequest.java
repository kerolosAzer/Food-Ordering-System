package com.FoodOrderingSystem.user_service.dto;

import com.FoodOrderingSystem.user_service.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;

    private String email;

    private String password;

    private String phone;

    private String address;

    private Role role;  
}
