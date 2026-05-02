package com.FoodOrderingSystem.restaurant_service.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("within(com.FoodOrderingSystem.restaurant_service.controller..*)")
    public void controllerLayer() {}

    @Pointcut("within(com.FoodOrderingSystem.restaurant_service.service..*)")
    public void serviceLayer() {}

    @Around("controllerLayer() || serviceLayer()")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {

        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        long startTime = System.currentTimeMillis();

        logger.info("AOP START -> {}.{}()", className, methodName);

        try {
            Object result = joinPoint.proceed();

            long executionTime = System.currentTimeMillis() - startTime;

            logger.info("AOP END -> {}.{}() | Execution time: {} ms",
                    className,
                    methodName,
                    executionTime
            );

            return result;

        } catch (Throwable ex) {
            long executionTime = System.currentTimeMillis() - startTime;

            logger.error("AOP ERROR -> {}.{}() | Execution time: {} ms | Error: {}",
                    className,
                    methodName,
                    executionTime,
                    ex.getMessage()
            );

            throw ex;
        }
    }
}