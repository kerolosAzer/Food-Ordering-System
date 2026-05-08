package com.FoodOrderingSystem.user_service.dto;

import com.FoodOrderingSystem.user_service.entity.Role;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;

    private String phone;

    private String address;

    // للأدمن فقط: تعديل دور المستخدم
    private Role role;
}