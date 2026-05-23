# Render Deployment Guide

This guide provides step-by-step instructions for deploying each service to Render.

## Deployment Order (IMPORTANT)

Deploy services in this exact order:

1. **Discovery Server** (Eureka Registry) - Must be first
2. **User Service** - No dependencies
3. **Restaurant Service** - No dependencies
4. **Payment Service** - No dependencies
5. **Delivery Service** - No dependencies
6. **Order Service** - Depends on Restaurant Service
7. **API Gateway** - Depends on all services

---

## Service Deployment Details

### 1. Discovery Server (Eureka)

**Render Service Type**: Web Service

**Build Command**:
```bash
cd discovery-server && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
EUREKA_HOSTNAME=<your-discovery-server-url>.onrender.com
PORT=8761
```

**Health Check URL**: `https://<your-discovery-server-url>.onrender.com/eureka/web`

---

### 2. User Service

**Render Service Type**: Web Service

**Build Command**:
```bash
cd user-service && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
PORT=8081
JWT_SECRET=<your-32-char-secret>
EUREKA_SERVER_URL=https://<your-discovery-server-url>.onrender.com/eureka/
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<your-db-password>
USER_DATABASE_URL=jdbc:postgresql://<host>:<port>/user_service_db?sslmode=require
```

**Health Check URL**: `https://<your-user-service-url>.onrender.com/actuator/health`

---

### 3. Restaurant Service

**Render Service Type**: Web Service

**Build Command**:
```bash
cd restaurant-service && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
PORT=8082
JWT_SECRET=<your-32-char-secret>
EUREKA_SERVER_URL=https://<your-discovery-server-url>.onrender.com/eureka/
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<your-db-password>
RESTAURANT_DATABASE_URL=jdbc:postgresql://<host>:<port>/restaurant_service_db?sslmode=require
```

---

### 4. Payment Service

**Render Service Type**: Web Service

**Build Command**:
```bash
cd payment-service && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
PORT=8084
JWT_SECRET=<your-32-char-secret>
EUREKA_SERVER_URL=https://<your-discovery-server-url>.onrender.com/eureka/
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<your-db-password>
PAYMENT_DATABASE_URL=jdbc:postgresql://<host>:<port>/payment_service_db?sslmode=require
```

---

### 5. Delivery Service

**Render Service Type**: Web Service

**Build Command**:
```bash
cd delivery-service && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
PORT=8086
JWT_SECRET=<your-32-char-secret>
EUREKA_SERVER_URL=https://<your-discovery-server-url>.onrender.com/eureka/
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<your-db-password>
DELIVERY_DATABASE_URL=jdbc:postgresql://<host>:<port>/delivery_service_db?sslmode=require
```

---

### 6. Order Service

**Render Service Type**: Web Service

**Build Command**:
```bash
cd order-service && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
PORT=8083
JWT_SECRET=<your-32-char-secret>
EUREKA_SERVER_URL=https://<your-discovery-server-url>.onrender.com/eureka/
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<your-db-password>
ORDER_DATABASE_URL=jdbc:postgresql://<host>:<port>/order_service_db?sslmode=require
```

---

### 7. API Gateway

**Render Service Type**: Web Service

**Build Command**:
```bash
cd api-gateway && ../mvnw clean package -DskipTests
```

**Start Command**:
```bash
java -jar target/*.jar
```

**Environment Variables**:
```
PORT=8085
EUREKA_SERVER_URL=https://<your-discovery-server-url>.onrender.com/eureka/
USER_SERVICE_URL=https://<your-user-service-url>.onrender.com
RESTAURANT_SERVICE_URL=https://<your-restaurant-service-url>.onrender.com
ORDER_SERVICE_URL=https://<your-order-service-url>.onrender.com
PAYMENT_SERVICE_URL=https://<your-payment-service-url>.onrender.com
DELIVERY_SERVICE_URL=https://<your-delivery-service-url>.onrender.com
FRONTEND_URL=https://<your-frontend-url>.vercel.app
```

**Health Check URL**: `https://<your-api-gateway-url>.onrender.com/actuator/health`

---

## Common Render Settings for All Services

### Instance Type
- Free Plan: Limited resources (good for development/testing)
- Starter Plan: 0.5GB RAM (minimum for production)
- Standard Plan: 2GB RAM (recommended for production)

### Auto-Deploy
- Enable automatic deployments from Git
- Render will redeploy when you push to your repository

### Resource Limits
- Memory: 512MB minimum for Java services
- CPU: Shared

### Timeout Settings
- Build timeout: 45 minutes
- Health check timeout: 60 seconds
- Request timeout: 300 seconds

---

## Database Setup Before Deployment

Before deploying services, ensure your PostgreSQL database is ready:

### Create All Required Databases

```sql
CREATE DATABASE user_service_db;
CREATE DATABASE restaurant_service_db;
CREATE DATABASE order_service_db;
CREATE DATABASE payment_service_db;
CREATE DATABASE delivery_service_db;
```

### Get Connection String Format

For PostgreSQL (Render/Supabase), URLs should look like:
```
jdbc:postgresql://host.region.provider.com:5432/database_name?sslmode=require
```

---

## Deployment Checklist

- [ ] PostgreSQL database created with all 5 databases
- [ ] GitHub repository is public or Render has access
- [ ] Java 17 is available (Render uses it by default)
- [ ] All environment variables are collected and verified
- [ ] Discovery Server deployed and healthy
- [ ] User Service deployed and healthy
- [ ] Restaurant Service deployed and healthy
- [ ] Payment Service deployed and healthy
- [ ] Delivery Service deployed and healthy
- [ ] Order Service deployed and healthy
- [ ] API Gateway deployed and healthy
- [ ] Frontend deployed on Vercel with correct API URL

---

## Deployment Troubleshooting

### Service won't start
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Ensure JWT_SECRET and EUREKA_SERVER_URL are correct
4. Check that database credentials are correct

### Services can't communicate
1. Verify EUREKA_SERVER_URL matches Discovery Server URL
2. Check service URLs in API Gateway environment variables
3. Ensure all services are running and healthy

### Database connection error
1. Verify database URL format
2. Confirm DATABASE_USERNAME and DATABASE_PASSWORD are correct
3. Ensure PostgreSQL database exists
4. Check if database accepts external connections

### Build failures
1. Check build logs for Java compilation errors
2. Ensure `pom.xml` files are correct
3. Verify Maven dependencies are available
4. Check for missing `mvnw` file in service directories

---

## Monitoring After Deployment

1. **Logs**: Check service logs in Render dashboard
2. **Health Checks**: Visit service health endpoints
3. **Eureka Dashboard**: View registered services at Discovery Server URL
4. **API Testing**: Use curl or Postman to test endpoints

---

## Cost Estimation (Render)

- **Free Plan**: Up to 750 hours/month per service (good for learning)
- **Starter Plan**: $7/month per service (0.5GB RAM)
- **Standard Plan**: $12/month per service (2GB RAM)
- **Plus Plan**: $29/month per service (4GB RAM)

For 7 services on Starter Plan: ~$49/month

---

## Next Steps After Deployment

1. Set up monitoring with Sentry or DataDog
2. Configure custom domain names
3. Set up SSL certificates
4. Implement automated deployments with GitHub Actions
5. Add rate limiting to API Gateway
6. Set up database backups
7. Configure email notifications for errors

---

**Last Updated**: May 2024
**Version**: 1.0
