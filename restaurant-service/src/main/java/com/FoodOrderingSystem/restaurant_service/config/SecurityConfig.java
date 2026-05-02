package com.FoodOrderingSystem.restaurant_service.config;

import com.FoodOrderingSystem.restaurant_service.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // Public endpoints
                .requestMatchers(HttpMethod.GET, "/api/restaurants/all").permitAll()

                // فتح قراءة المنيو بدون توكن
                .requestMatchers(HttpMethod.GET, "/api/menu", "/api/menu/**").permitAll()

                // Reviews: logged-in users
                .requestMatchers(HttpMethod.POST, "/api/reviews/add")
                    .hasAnyRole("CUSTOMER", "USER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reviews/restaurant/**")
                    .hasAnyRole("CUSTOMER", "USER", "ADMIN")

                // Restaurant admin endpoints
                .requestMatchers(HttpMethod.POST, "/api/restaurants/add").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/restaurants/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/restaurants/**").hasRole("ADMIN")

                // Menu admin endpoints
                .requestMatchers(HttpMethod.POST, "/api/menu/add").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}