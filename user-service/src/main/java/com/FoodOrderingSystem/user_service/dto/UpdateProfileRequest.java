package com.FoodOrderingSystem.user_service.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;

    private String phone;

    private String address;
}