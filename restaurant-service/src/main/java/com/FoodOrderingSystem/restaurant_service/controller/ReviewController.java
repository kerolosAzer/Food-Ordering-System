package com.FoodOrderingSystem.restaurant_service.controller;

import com.FoodOrderingSystem.restaurant_service.entity.Review;
import com.FoodOrderingSystem.restaurant_service.service.ReviewService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // إضافة تعليق وتقييم للمطعم (مفتوح للجميع)
    @PostMapping("/add")
    public Review addReview(@RequestBody @NonNull Review review) {
        return reviewService.addReview(review);
    }

    // الحصول على جميع التقييمات للمطعم حسب ID
    @GetMapping("/restaurant/{restaurantId}")
    public List<Review> getReviews(@PathVariable Long restaurantId) {
        return reviewService.getReviewsByRestaurantId(restaurantId);
    }
}