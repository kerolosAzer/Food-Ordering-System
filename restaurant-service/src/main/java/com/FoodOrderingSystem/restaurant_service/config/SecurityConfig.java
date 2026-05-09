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

                        // Public menu read endpoints
                        .requestMatchers(HttpMethod.GET, "/api/menu", "/api/menu/**").permitAll()

                        // Reviews endpoints
                        .requestMatchers(HttpMethod.POST, "/api/reviews/add")
                        .hasAnyAuthority("CUSTOMER", "USER", "ADMIN", "ROLE_CUSTOMER", "ROLE_USER", "ROLE_ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/reviews/restaurant/**")
                        .hasAnyAuthority("CUSTOMER", "USER", "ADMIN", "ROLE_CUSTOMER", "ROLE_USER", "ROLE_ADMIN")

                        // Restaurant admin endpoints
                        .requestMatchers(HttpMethod.POST, "/api/restaurants/add")
                        .hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/restaurants/**")
                        .hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/restaurants/**")
                        .hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        // Menu admin endpoints
                        .requestMatchers(HttpMethod.POST, "/api/menu/add")
                        .hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/menu/**")
                        .hasAnyAuthority("ADMIN", "ROLE_ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/menu/**")
                        .hasAnyAuthority("ADMIN", "ROLE_ADMIN")

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