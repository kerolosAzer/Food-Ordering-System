# Food Ordering System - Cloud Deployment Guide

## Overview

This guide provides step-by-step instructions to deploy the Food Ordering System to Render (backend) and Vercel (frontend) using PostgreSQL cloud databases.

## Architecture

- **Backend Services**: Deployed on Render as independent services
  - API Gateway
  - Discovery Server (Eureka)
  - User Service
  - Restaurant Service
  - Order Service
  - Payment Service
  - Delivery Service

- **Frontend**: Deployed on Vercel
  - React Application

- **Database**: PostgreSQL (Supabase or Render PostgreSQL)

## Prerequisites

1. Render account (https://render.com)
2. Vercel account (https://vercel.com)
3. PostgreSQL cloud database account (Supabase or Render PostgreSQL)
4. Git repository with the code
5. GitHub account for CI/CD integration

## Part 1: Database Setup

### Option A: Using Supabase (Recommended)

1. Create account at https://supabase.com
2. Create a new project
3. Wait for project to be ready
4. Get connection string from Settings > Database > Connection Pooling
5. Create databases and schemas:

```sql
-- Create databases
CREATE DATABASE user_service_db;
CREATE DATABASE restaurant_service_db;
CREATE DATABASE order_service_db;
CREATE DATABASE payment_service_db;
CREATE DATABASE delivery_service_db;
```

### Option B: Using Render PostgreSQL

1. Sign in to Render dashboard
2. Create a new PostgreSQL database
3. Copy the external database URL
4. Create all databases using the same process as above

## Part 2: Environment Variables Setup

### Global Environment Variables (All Services)

```
JWT_SECRET=your-long-random-secret-key-min-32-chars
EUREKA_SERVER_URL=https://your-discovery-server.onrender.com/eureka/
```

### Database Configuration

```
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-db-password
```

### Service-Specific Database URLs

```
USER_DATABASE_URL=jdbc:postgresql://host:port/user_service_db?sslmode=require
RESTAURANT_DATABASE_URL=jdbc:postgresql://host:port/restaurant_service_db?sslmode=require
ORDER_DATABASE_URL=jdbc:postgresql://host:port/order_service_db?sslmode=require
PAYMENT_DATABASE_URL=jdbc:postgresql://host:port/payment_service_db?sslmode=require
DELIVERY_DATABASE_URL=jdbc:postgresql://host:port/delivery_service_db?sslmode=require
```

### Service URLs (For API Gateway)

```
USER_SERVICE_URL=https://your-user-service.onrender.com
RESTAURANT_SERVICE_URL=https://your-restaurant-service.onrender.com
ORDER_SERVICE_URL=https://your-order-service.onrender.com
PAYMENT_SERVICE_URL=https://your-payment-service.onrender.com
DELIVERY_SERVICE_URL=https://your-delivery-service.onrender.com
```

### Frontend Configuration

```
FRONTEND_URL=https://your-frontend.vercel.app
REACT_APP_API_BASE_URL=https://your-api-gateway.onrender.com
```

## Part 3: Deploy Discovery Server (Eureka)

This must be deployed first as other services depend on it.

### On Render:

1. Create new Web Service
2. Connect your Git repository
3. Set Build Command:
   ```
   ./mvnw clean package -DskipTests
   ```
4. Set Start Command:
   ```
   java -jar target/*.jar
   ```
5. Set Environment Variables:
   - `PORT=8761`
   - `EUREKA_HOSTNAME=your-discovery-server.onrender.com`
   - `EUREKA_SERVER_URL=http://localhost:8761/eureka/`

6. Deploy

Wait for successful deployment before proceeding.

## Part 4: Deploy Backend Services

Deploy services in this order:
1. User Service
2. Restaurant Service
3. Payment Service
4. Delivery Service
5. Order Service
6. API Gateway

### For Each Backend Service on Render:

1. Create new Web Service
2. Connect Git repository
3. Select the service directory
4. Set Build Command:
   ```
   ./mvnw clean package -DskipTests
   ```
5. Set Start Command:
   ```
   java -jar target/*.jar
   ```
6. Set Environment Variables:
   ```
   JWT_SECRET=your-long-random-secret-key
   EUREKA_SERVER_URL=https://your-discovery-server.onrender.com/eureka/
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your-db-password
   [SERVICE]_DATABASE_URL=jdbc:postgresql://host:port/[service]_service_db?sslmode=require
   ```

7. For API Gateway only, add:
   ```
   USER_SERVICE_URL=https://your-user-service.onrender.com
   RESTAURANT_SERVICE_URL=https://your-restaurant-service.onrender.com
   ORDER_SERVICE_URL=https://your-order-service.onrender.com
   PAYMENT_SERVICE_URL=https://your-payment-service.onrender.com
   DELIVERY_SERVICE_URL=https://your-delivery-service.onrender.com
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

8. Deploy each service

Note: Render's free tier has 50-hour/month limit. Use paid tier for production.

## Part 5: Deploy Frontend on Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the `frontend/my-react-app` directory as the root
4. Set Build Command:
   ```
   npm install && npm run build
   ```
5. Set Output Directory:
   ```
   build
   ```
6. Add Environment Variable:
   ```
   REACT_APP_API_BASE_URL=https://your-api-gateway.onrender.com
   ```
7. Deploy

## Part 6: Testing the Deployment

### Test API Gateway Health

```bash
curl https://your-api-gateway.onrender.com/actuator/health
```

### Test User Service

```bash
curl https://your-api-gateway.onrender.com/user-service/api/users
```

### Test Frontend

Open https://your-frontend.vercel.app in browser

### Test User Registration

POST request to `https://your-api-gateway.onrender.com/user-service/api/auth/register`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userRole": "CUSTOMER"
}
```

## Part 7: Local Development with Docker

To run locally with PostgreSQL instead of SQL Server:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Discovery Server
- API Gateway
- All microservices

Access the application at `http://localhost:3000` (frontend) and `http://localhost:8085` (API Gateway).

## Database Schema Notes

The Hibernate `ddl-auto=update` setting will automatically create/update tables based on entity definitions when services start.

For production, consider using Flyway or Liquibase for database migrations.

## Security Considerations

1. **JWT Secret**: Use a strong, random key (minimum 32 characters)
   ```bash
   openssl rand -base64 32
   ```

2. **Database Passwords**: Use strong passwords, store in secure environment variables

3. **CORS**: The API Gateway is configured to accept requests from:
   - Development: `http://localhost:3000`, `http://localhost:3001`
   - Production: `https://your-frontend.vercel.app`

4. **SSL/TLS**: All production connections use `sslmode=require` for PostgreSQL

## Troubleshooting

### Services can't connect to database

- Verify database credentials in environment variables
- Check that database URLs include `?sslmode=require`
- Ensure your PostgreSQL server allows external connections

### Services can't discover each other

- Verify `EUREKA_SERVER_URL` is correctly set in all services
- Check that Discovery Server is running and accessible

### Frontend can't reach API

- Verify `REACT_APP_API_BASE_URL` environment variable is set correctly
- Check CORS configuration in API Gateway
- Ensure frontend URL is in `FRONTEND_URL` environment variable

### JWT authentication failing

- Verify `JWT_SECRET` is identical across all services
- Check that tokens are being sent with `Authorization: Bearer <token>` header

## Monitoring and Logging

Monitor your services on Render:
1. Go to your service dashboard
2. Check "Logs" tab for real-time logs
3. Check "Metrics" tab for resource usage

## Next Steps

1. Set up database backups
2. Configure custom domain names
3. Set up SSL certificates
4. Implement automated deployments with GitHub Actions
5. Add monitoring and alerting
6. Implement rate limiting
7. Add API documentation with Swagger/OpenAPI

## Support Resources

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Spring Boot on Cloud: https://spring.io/guides/gs/cloud-services/

---

**Last Updated**: May 2024
**Version**: 1.0
