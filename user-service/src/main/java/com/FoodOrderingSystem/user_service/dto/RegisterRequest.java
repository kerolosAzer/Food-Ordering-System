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
// This class is used to capture the registration details of a
//  new user. It includes fields for the user's name, email, password, phone number, address, and role (which can be ADMIN, CUSTOMER, or DELIVERY).
// DTO معناها Data Transfer Object.
// DTO: يعني كلاس مخصص لاستقبال أو إرسال بيانات من وإلى الـ API.