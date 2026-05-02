package com.FoodOrderingSystem.order_service.dto;

import lombok.Data;

@Data
public class MenuItemResponse {

    private Long id;

    private Long restaurantId;

    private String name;

    private Double price;

    private Boolean available;
}