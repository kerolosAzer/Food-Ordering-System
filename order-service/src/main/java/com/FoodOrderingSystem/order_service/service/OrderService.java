package com.FoodOrderingSystem.order_service.service;

import com.FoodOrderingSystem.order_service.dto.CreateOrderRequest;
import com.FoodOrderingSystem.order_service.dto.MenuItemResponse;
import com.FoodOrderingSystem.order_service.dto.OrderItemResponse;
import com.FoodOrderingSystem.order_service.dto.OrderResponse;
import com.FoodOrderingSystem.order_service.entity.Order;
import com.FoodOrderingSystem.order_service.entity.OrderItem;
import com.FoodOrderingSystem.order_service.entity.OrderStatus;
import com.FoodOrderingSystem.order_service.entity.PaymentStatus;
import com.FoodOrderingSystem.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // RestClient لتمرير طلبات إلى restaurant-service
    private final RestClient.Builder restClientBuilder;

    // إنشاء طلب جديد مع إضافة Authorization header
    public OrderResponse createOrder(CreateOrderRequest request, String authorizationHeader) {

        Order order = new Order();

        // ربط الطلب بالعميل
        order.setCustomerId(request.getCustomerId());

        // ربط الطلب بالمطعم
        order.setRestaurantId(request.getRestaurantId());

        // تحديد وقت إنشاء الطلب
        order.setOrderDate(LocalDateTime.now());

        // الحالة الافتراضية للطلب أول ما يتعمل
        order.setOrderStatus(OrderStatus.PENDING);

        // طريقة الدفع المختارة من المستخدم
        order.setPaymentMethod(request.getPaymentMethod());

        // حالة الدفع الافتراضية في البداية
        order.setPaymentStatus(PaymentStatus.UNPAID);

        // تحويل عناصر الطلب القادمة من الـ request إلى OrderItem entities
        List<OrderItem> orderItems = request.getItems()
                .stream()
                .map(itemRequest -> {

                    // جلب بيانات الطبق من restaurant-service باستخدام menuItemId
                    MenuItemResponse menuItem = restClientBuilder.build()
                            .get()
                            .uri("http://RESTAURANT-SERVICE/api/menu/{id}", itemRequest.getMenuItemId())
                            .header("Authorization", authorizationHeader)  // إضافة الـ Authorization Header
                            .retrieve()
                            .body(MenuItemResponse.class);

                    if (menuItem == null) {
                        throw new RuntimeException("Menu item not found");
                    }

                    if (menuItem.getPrice() == null) {
                        throw new RuntimeException("Menu item price not found");
                    }

                    if (menuItem.getRestaurantId() == null) {
                        throw new RuntimeException("Menu item restaurant id not found");
                    }

                    // التأكد إن الطبق تابع لنفس المطعم الموجود في الطلب
                    if (!menuItem.getRestaurantId().equals(request.getRestaurantId())) {
                        throw new RuntimeException("Menu item does not belong to this restaurant");
                    }

                    OrderItem item = new OrderItem();

                    item.setMenuItemId(itemRequest.getMenuItemId());
                    item.setQuantity(itemRequest.getQuantity());

                    // السعر الحقيقي من restaurant-service وليس من request
                    item.setPrice(menuItem.getPrice());

                    // مهم جدًا لربط كل item بالـ order الأساسي
                    item.setOrder(order);

                    return item;
                })
                .toList();

        // حساب السعر الكلي = سعر كل item × الكمية
        double totalPrice = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        // إضافة العناصر للطلب
        order.setItems(orderItems);

        // حفظ السعر الكلي
        order.setTotalPrice(totalPrice);

        // حفظ الطلب في الداتابيز
        Order savedOrder = orderRepository.save(order);

        // تحويل الـ entity إلى response مناسب للـ API
        return mapToOrderResponse(savedOrder);
    }

    // جلب طلب واحد باستخدام الـ id
    public OrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return mapToOrderResponse(order);
    }

    // جلب كل الطلبات
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    // جلب كل الطلبات الخاصة بعميل معين
    public List<OrderResponse> getOrdersByCustomerId(Long customerId) {

        return orderRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    // جلب كل الطلبات الخاصة بمطعم معين
    public List<OrderResponse> getOrdersByRestaurantId(Long restaurantId) {

        return orderRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    // تحديث حالة الطلب مع منع الانتقالات غير المنطقية
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getOrderStatus();

        // الطلب الملغي لا يمكن تغيير حالته مرة أخرى
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cancelled order status cannot be updated");
        }

        // الطلب الذي تم توصيله لا يمكن تغيير حالته مرة أخرى
        if (currentStatus == OrderStatus.DELIVERED) {
            throw new RuntimeException("Delivered order status cannot be updated");
        }

        // منع القفز أو الرجوع بين الحالات بطريقة غير منطقية
        if (!isValidStatusTransition(currentStatus, status)) {
            throw new RuntimeException("Invalid order status transition from " + currentStatus + " to " + status);
        }

        order.setOrderStatus(status);

        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    // التأكد إن انتقال حالة الطلب منطقي
    private boolean isValidStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {

        // لو نفس الحالة، نسمح بها لأنها لا تغير شيئًا فعليًا
        if (currentStatus == newStatus) {
            return true;
        }

        return switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED
                    || newStatus == OrderStatus.CANCELLED;

            case CONFIRMED -> newStatus == OrderStatus.PREPARING
                    || newStatus == OrderStatus.CANCELLED;

            case PREPARING -> newStatus == OrderStatus.OUT_FOR_DELIVERY;

            case OUT_FOR_DELIVERY -> newStatus == OrderStatus.DELIVERED;

            case DELIVERED, CANCELLED -> false;
        };
    }

    // إلغاء الطلب
    public OrderResponse cancelOrder(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // الطلب الذي تم توصيله لا يمكن إلغاؤه
        if (order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Delivered order cannot be cancelled");
        }

        // لو الطلب ملغي بالفعل لا نلغيه مرة أخرى
        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        Order cancelledOrder = orderRepository.save(order);

        return mapToOrderResponse(cancelledOrder);
    }

    // تحديث حالة الدفع مثل PAID أو FAILED
    public OrderResponse updatePaymentStatus(Long id, PaymentStatus paymentStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // الطلب الملغي لا يجب تعديل حالة الدفع الخاصة به
        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cancelled order payment status cannot be updated");
        }

        order.setPaymentStatus(paymentStatus);

        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    // تحويل Order entity إلى OrderResponse DTO
    private OrderResponse mapToOrderResponse(Order order) {

        // تحويل items من Entity إلى Response DTO
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getMenuItemId(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCustomerId(),
                order.getRestaurantId(),
                order.getOrderDate(),
                order.getOrderStatus(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses
        );
    }
}