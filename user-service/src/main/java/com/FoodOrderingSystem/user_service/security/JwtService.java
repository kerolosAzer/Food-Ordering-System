package com.FoodOrderingSystem.user_service.security;

import com.FoodOrderingSystem.user_service.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    // In a real application, use a more secure way to manage the secret key
    private static final String SECRET_KEY =
            "my-super-secret-key-for-food-ordering-system-must-be-long";

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }
    // Generate JWT token for a user

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("id", user.getId())
                .claim("name", user.getName())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }
// Extract claims from the token
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
// Extract email (subject) from the token
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
// Validate the token against a user
    public boolean isTokenValid(String token, User user) {
        String email = extractEmail(token);
        return email.equals(user.getEmail()) && !isTokenExpired(token);
    }
// Check if the token is expired
    private boolean isTokenExpired(String token) {
        Date expiration = extractClaims(token).getExpiration();
        return expiration.before(new Date());
    }
}