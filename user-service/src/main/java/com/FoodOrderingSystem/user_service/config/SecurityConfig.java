package com.FoodOrderingSystem.user_service.config;

import com.FoodOrderingSystem.user_service.repository.UserRepository;
import com.FoodOrderingSystem.user_service.security.JwtAuthenticationFilter;
import com.FoodOrderingSystem.user_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        return new JwtAuthenticationFilter(jwtService, userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // فتح مسارات الـ register و login
                        .requestMatchers("/h2-console/**").permitAll() // فتح الـ H2 Console

                        // إضافة صلاحيات للأدمن
                        .requestMatchers(HttpMethod.GET, "/api/users/all").hasRole("ADMIN") // فقط الأدمن يستطيع الحصول على كل المستخدمين
                        .requestMatchers(HttpMethod.GET, "/api/users/{id}").hasRole("ADMIN") // فقط الأدمن يستطيع الحصول على مستخدم معين حسب ID
                        .requestMatchers(HttpMethod.DELETE, "/api/users/{id}").hasRole("ADMIN") // فقط الأدمن يستطيع حذف مستخدم حسب ID

                        .requestMatchers("/api/users/**").authenticated() // باقي المسارات محمية بالتوكن

                        .anyRequest().authenticated() // أي طلب آخر يجب أن يكون مستخدم مسجل دخول
                )
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // تعطيل الـ frameOptions لتسمح بـ H2 Console
                .authenticationProvider(authenticationProvider()) // استخدام الـ AuthenticationProvider
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // إضافة الفلتر للتحقق من التوكن

        return http.build();
    }
}