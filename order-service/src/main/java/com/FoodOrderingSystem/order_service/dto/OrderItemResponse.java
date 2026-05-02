package com.FoodOrderingSystem.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemResponse {

    private Long id;

    private Long menuItemId;

    private Integer quantity;

    private Double price;
}