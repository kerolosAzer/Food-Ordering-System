package com.FoodOrderingSystem.user_service.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;

    private String password;
}
// This class is used to capture the login details of a user. It includes fields for the user's email and password, which are required for authentication during the login process.
