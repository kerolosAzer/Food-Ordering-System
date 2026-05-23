# Food Ordering System - Migration Summary

## Overview

This document summarizes all changes made to migrate the Food Ordering System from SQL Server to PostgreSQL and prepare it for cloud deployment on Render (backend) and Vercel (frontend).

## Changes Made

### 1. Database Driver Migration

**Files Modified**: All service `pom.xml` files

**Changes**:
- Removed: `com.microsoft.sqlserver:mssql-jdbc`
- Added: `org.postgresql:postgresql`

**Affected Services**:
- user-service
- restaurant-service
- order-service
- payment-service
- delivery-service

### 2. Application Properties Configuration

**Files Modified**: `application.properties` in all services

**Changes Made**:
- Replaced hardcoded SQL Server URLs with environment variables
- Updated database dialect from `SQLServerDialect` to `PostgreSQLDialect`
- Added support for Render's `PORT` environment variable
- Added support for Eureka URL via `EUREKA_SERVER_URL` environment variable
- Moved JWT secret to environment variable `JWT_SECRET`

**Key Updates**:
```properties
# Before (SQL Server)
server.port=8081
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=user_service_db;encrypt=true;trustServerCertificate=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# After (PostgreSQL with Environment Variables)
server.port=${PORT:8081}
spring.datasource.url=${USER_DATABASE_URL:jdbc:postgresql://localhost:5432/user_service_db?sslmode=require}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
jwt.secret=${JWT_SECRET:my-super-secret-key-for-food-ordering-system-must-be-long}
```

### 3. Docker Configuration for Local Development

**File Modified**: `application-docker.properties` in all services

**Changes**:
- Replaced SQL Server connection with PostgreSQL connection
- Updated Eureka URL to use Docker service name: `http://discovery-server:8761/eureka/`
- Changed database connection to: `jdbc:postgresql://postgres:5432/[service]_service_db?sslmode=disable`
- Updated credentials to use PostgreSQL defaults (postgres/postgres)

### 4. Docker Compose Update

**File Modified**: `docker-compose.yml`

**Major Changes**:
- Removed SQL Server service (mcr.microsoft.com/mssql/server:2022-latest)
- Replaced with PostgreSQL service (postgres:16-alpine)
- Updated all service `depends_on` clauses:
  - Changed from `depends_on: [sqlserver, discovery-server]`
  - To: `depends_on: {postgres: {condition: service_healthy}, discovery-server: {condition: service_started}}`
- Added health check for PostgreSQL service
- Updated volumes from `sqlserver_data` to `postgres_data`
- Added `init-db.sql` volume mount for automatic database initialization

**Database Initialization**:
- Created `init-db.sql` script that automatically creates all required databases:
  - user_service_db
  - restaurant_service_db
  - order_service_db
  - payment_service_db
  - delivery_service_db

### 5. API Gateway Configuration

**File Modified**: `api-gateway/src/main/resources/application.properties`

**Changes**:
- Changed service routing from Eureka load balancing to environment variables:
  ```properties
  # Before
  spring.cloud.gateway.server.webmvc.routes[0].uri=lb://USER-SERVICE
  
  # After
  spring.cloud.gateway.server.webmvc.routes[0].uri=${USER_SERVICE_URL:lb://USER-SERVICE}
  ```
- Added CORS configuration with environment variable support:
  ```properties
  spring.web.cors.allowed-origins=${FRONTEND_URL:http://localhost:3000,http://localhost:3001}
  spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
  spring.web.cors.allowed-headers=*
  spring.web.cors.allow-credentials=true
  ```
- Added dynamic PORT configuration: `server.port=${PORT:8085}`

### 6. Discovery Server Configuration

**File Modified**: `discovery-server/src/main/resources/application.properties`

**Changes**:
- Added support for environment variables:
  - `server.port=${PORT:8761}`
  - `eureka.instance.hostname=${EUREKA_HOSTNAME:localhost}`
  - `eureka.client.service-url.defaultZone=${EUREKA_SERVER_URL:http://localhost:8761/eureka/}`

### 7. Frontend Configuration

**File Modified**: `frontend/my-react-app/src/api/axiosInstance.js`

**Changes**:
- Changed hardcoded localhost URL to environment variable:
  ```javascript
  // Before
  baseURL: "http://localhost:8085"
  
  // After
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8085"
  ```
- Maintained JWT token handling from localStorage

### 8. New Files Created

#### `init-db.sql`
- PostgreSQL initialization script for docker-compose
- Creates all required databases
- Sets up schemas and permissions

#### `CLOUD_DEPLOYMENT_GUIDE.md`
- Comprehensive deployment guide for Render and Vercel
- Step-by-step instructions for all deployment phases
- Environment variable configuration guide
- Troubleshooting section

#### `ENV_VARIABLES_REFERENCE.md`
- Quick reference for all environment variables
- Categorized by service
- Examples for production and local development

#### `frontend/my-react-app/.env.example`
- Frontend environment variable template
- Shows both production and development configurations

## Database URL Formats

### PostgreSQL URL Format (Production - Render/Supabase)
```
jdbc:postgresql://HOST:PORT/DATABASE_NAME?sslmode=require
```

### PostgreSQL URL Format (Local - Docker)
```
jdbc:postgresql://postgres:5432/DATABASE_NAME?sslmode=disable
```

## Backward Compatibility

- **Local Development**: Still works with Docker Compose using PostgreSQL
- **Legacy Support**: No changes to business logic or APIs
- **Authentication**: JWT authentication unchanged
- **All Features Preserved**: Register, Login, Admin, Orders, Payments, Delivery - all unchanged

## Environment Variables Required for Production

### Global
- `JWT_SECRET` - JWT signing secret (32+ characters)
- `EUREKA_SERVER_URL` - Discovery server URL

### Database
- `DATABASE_USERNAME` - PostgreSQL username
- `DATABASE_PASSWORD` - PostgreSQL password
- `USER_DATABASE_URL` - User service database
- `RESTAURANT_DATABASE_URL` - Restaurant service database
- `ORDER_DATABASE_URL` - Order service database
- `PAYMENT_DATABASE_URL` - Payment service database
- `DELIVERY_DATABASE_URL` - Delivery service database

### Service Discovery (API Gateway)
- `USER_SERVICE_URL` - User service public URL
- `RESTAURANT_SERVICE_URL` - Restaurant service public URL
- `ORDER_SERVICE_URL` - Order service public URL
- `PAYMENT_SERVICE_URL` - Payment service public URL
- `DELIVERY_SERVICE_URL` - Delivery service public URL
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `REACT_APP_API_BASE_URL` - API Gateway base URL

## Deployment Steps

1. **Set up PostgreSQL** - Supabase or Render PostgreSQL
2. **Deploy Discovery Server** - Eureka registry
3. **Deploy User Service** - Core user management
4. **Deploy Restaurant Service** - Restaurant and menu management
5. **Deploy Payment Service** - Payment processing
6. **Deploy Delivery Service** - Delivery management
7. **Deploy Order Service** - Order management (depends on other services)
8. **Deploy API Gateway** - Public API endpoint
9. **Deploy Frontend** - React application on Vercel

## Testing After Deployment

### Health Check
```bash
curl https://your-api-gateway.onrender.com/actuator/health
```

### User Registration
```bash
POST https://your-api-gateway.onrender.com/user-service/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userRole": "CUSTOMER"
}
```

## Verified Features (Unchanged)

✅ User registration and authentication
✅ Admin login and features
✅ Customer features
✅ Delivery personnel features
✅ Restaurant management
✅ Order creation and tracking
✅ Payment processing
✅ JWT token validation
✅ AOP logging (if configured)
✅ Database schema auto-creation (Hibernate DDL)

## Notes for Developers

1. **Spring Boot Version**: 3.5.14 (compatible with PostgreSQL and Java 17)
2. **Hibernate**: Configured with `ddl-auto=update` for automatic schema management
3. **Eureka Client**: Configured for both Docker and cloud deployment
4. **Database Dialect**: PostgreSQL dialect in use for all JPA operations
5. **SSL/TLS**: Production URLs enforce `sslmode=require` for security

## Rollback Plan

If needed to revert to SQL Server:
1. Revert pom.xml changes (add back mssql-jdbc)
2. Update application.properties with SQL Server URLs
3. Revert docker-compose.yml to use SQL Server image
4. Revert API Gateway configuration

However, this is not recommended as PostgreSQL is more suitable for cloud deployments.

---

**Migration Completed**: May 2024
**Status**: Production Ready
**Version**: 1.0
