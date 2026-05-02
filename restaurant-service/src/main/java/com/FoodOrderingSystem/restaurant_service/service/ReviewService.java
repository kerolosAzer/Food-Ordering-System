package com.FoodOrderingSystem.restaurant_service.service;

import com.FoodOrderingSystem.restaurant_service.entity.Review;
import com.FoodOrderingSystem.restaurant_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // إضافة تعليق وتقييم للمطعم
    public Review addReview(@NonNull Review review) {
        return reviewRepository.save(review);
    }

    // الحصول على جميع التقييمات للمطعم حسب ID
    public List<Review> getReviewsByRestaurantId(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }
}