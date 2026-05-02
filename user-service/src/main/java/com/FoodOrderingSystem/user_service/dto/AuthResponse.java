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
// this tokens are very important
// ده JWT token اللي بنستخدمه بعد كده في أي API محمية.
    private String token;

    private String message;
}
// This class is used to send the authentication response back to
// the client after a successful login or registration. It contains the user's id, name, email,
//  role, and a message indicating the success of the operation.
