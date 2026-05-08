package com.FoodOrderingSystem.delivery_service.aspect;

import com.FoodOrderingSystem.delivery_service.service.SystemLogService;
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

    private final SystemLogService systemLogService;

    public LoggingAspect(SystemLogService systemLogService) {
        this.systemLogService = systemLogService;
    }

    @Pointcut("within(com.FoodOrderingSystem.delivery_service.controller..*)")
    public void controllerLayer() {
    }

    @Pointcut("within(com.FoodOrderingSystem.delivery_service.service..*)")
    public void serviceLayer() {
    }

    @Around("(controllerLayer() || serviceLayer()) && !within(com.FoodOrderingSystem.delivery_service.service.SystemLogService)")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {

        String serviceName = "delivery-service";
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        long startTime = System.currentTimeMillis();

        logger.info("AOP START -> {}.{}()", className, methodName);

        try {
            Object result = joinPoint.proceed();

            long executionTime = System.currentTimeMillis() - startTime;

            logger.info(
                    "AOP END -> {}.{}() | Execution time: {} ms",
                    className,
                    methodName,
                    executionTime
            );

            systemLogService.saveLog(
                    serviceName,
                    className,
                    methodName,
                    "METHOD_EXECUTION",
                    "SUCCESS",
                    "AOP END -> " + className + "." + methodName + "()",
                    executionTime
            );

            return result;

        } catch (Throwable ex) {
            long executionTime = System.currentTimeMillis() - startTime;

            logger.error(
                    "AOP ERROR -> {}.{}() | Execution time: {} ms | Error: {}",
                    className,
                    methodName,
                    executionTime,
                    ex.getMessage()
            );

            systemLogService.saveLog(
                    serviceName,
                    className,
                    methodName,
                    "METHOD_EXECUTION",
                    "ERROR",
                    "AOP ERROR -> " + className + "." + methodName + "() | Error: " + ex.getMessage(),
                    executionTime
            );

            throw ex;
        }
    }
}