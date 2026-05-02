package com.FoodOrderingSystem.restaurant_service.entity;

import lombok.Data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Data
@Entity
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    /**
     * Convenience accessor for cases where only the FK id is needed.
     * Prefer using {@link #getRestaurant()} when possible.
     */
    public Long getRestaurantId() {
        return restaurant != null ? restaurant.getId() : null;
    }
}