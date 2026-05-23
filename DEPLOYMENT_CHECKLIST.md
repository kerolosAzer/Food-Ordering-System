# Food Ordering System - Complete Deployment Checklist

This checklist guides you through deploying the Food Ordering System to production on Render and Vercel.

## Phase 1: Pre-Deployment Setup (1-2 hours)

### Database Setup
- [ ] Create PostgreSQL account (Supabase or Render)
- [ ] Create PostgreSQL instance
- [ ] Get database connection URL with format: `jdbc:postgresql://host:port/db?sslmode=require`
- [ ] Create 5 databases:
  - user_service_db
  - restaurant_service_db
  - order_service_db
  - payment_service_db
  - delivery_service_db
- [ ] Test database connection
- [ ] Document connection string

### GitHub Repository
- [ ] Push code to GitHub
- [ ] Ensure all changes are committed:
  - pom.xml files updated
  - application.properties updated
  - docker-compose.yml updated
  - init-db.sql created
  - Guides created
- [ ] Verify GitHub repository is accessible from Render

### Generate Secrets
- [ ] Generate JWT_SECRET (32+ characters):
  ```bash
  openssl rand -base64 32
  ```
- [ ] Create strong database password
- [ ] Save all secrets securely (use password manager)

### Collect Environment Variables

**Fill in your values**:
```
DATABASE_HOST = ___________________
DATABASE_PORT = ___________________
DATABASE_USERNAME = ___________________
DATABASE_PASSWORD = ___________________
JWT_SECRET = ___________________
GITHUB_REPO_URL = ___________________
```

---

## Phase 2: Render Backend Deployment (2-3 hours)

### Step 1: Deploy Discovery Server (Eureka Registry)

- [ ] Go to https://render.com/dashboard
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] **Name**: discovery-server
- [ ] **Environment**: Docker (automatic) or select Runtime: Node
- [ ] **Build Command**:
  ```
  cd discovery-server && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Plan**: Starter (or Free for testing)
- [ ] **Environment Variables**:
  ```
  EUREKA_HOSTNAME=discovery-server.onrender.com
  PORT=8761
  ```
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Save URL: `https://discovery-server.onrender.com`
- [ ] Test: Open `https://discovery-server.onrender.com/eureka/web`
- [ ] Verify: Should see Eureka dashboard

### Step 2: Deploy User Service

- [ ] Create new Web Service
- [ ] **Name**: food-user-service
- [ ] **Build Command**:
  ```
  cd user-service && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Environment Variables**:
  ```
  PORT=8081
  JWT_SECRET=<your-jwt-secret>
  EUREKA_SERVER_URL=https://discovery-server.onrender.com/eureka/
  DATABASE_USERNAME=<your-username>
  DATABASE_PASSWORD=<your-password>
  USER_DATABASE_URL=jdbc:postgresql://<host>:<port>/user_service_db?sslmode=require
  ```
- [ ] Save URL for later

### Step 3: Deploy Restaurant Service

- [ ] Create new Web Service
- [ ] **Name**: food-restaurant-service
- [ ] **Build Command**:
  ```
  cd restaurant-service && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Environment Variables**:
  ```
  PORT=8082
  JWT_SECRET=<your-jwt-secret>
  EUREKA_SERVER_URL=https://discovery-server.onrender.com/eureka/
  DATABASE_USERNAME=<your-username>
  DATABASE_PASSWORD=<your-password>
  RESTAURANT_DATABASE_URL=jdbc:postgresql://<host>:<port>/restaurant_service_db?sslmode=require
  ```

### Step 4: Deploy Payment Service

- [ ] Create new Web Service
- [ ] **Name**: food-payment-service
- [ ] **Build Command**:
  ```
  cd payment-service && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Environment Variables**:
  ```
  PORT=8084
  JWT_SECRET=<your-jwt-secret>
  EUREKA_SERVER_URL=https://discovery-server.onrender.com/eureka/
  DATABASE_USERNAME=<your-username>
  DATABASE_PASSWORD=<your-password>
  PAYMENT_DATABASE_URL=jdbc:postgresql://<host>:<port>/payment_service_db?sslmode=require
  ```

### Step 5: Deploy Delivery Service

- [ ] Create new Web Service
- [ ] **Name**: food-delivery-service
- [ ] **Build Command**:
  ```
  cd delivery-service && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Environment Variables**:
  ```
  PORT=8086
  JWT_SECRET=<your-jwt-secret>
  EUREKA_SERVER_URL=https://discovery-server.onrender.com/eureka/
  DATABASE_USERNAME=<your-username>
  DATABASE_PASSWORD=<your-password>
  DELIVERY_DATABASE_URL=jdbc:postgresql://<host>:<port>/delivery_service_db?sslmode=require
  ```

### Step 6: Deploy Order Service

- [ ] Create new Web Service
- [ ] **Name**: food-order-service
- [ ] **Build Command**:
  ```
  cd order-service && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Environment Variables**:
  ```
  PORT=8083
  JWT_SECRET=<your-jwt-secret>
  EUREKA_SERVER_URL=https://discovery-server.onrender.com/eureka/
  DATABASE_USERNAME=<your-username>
  DATABASE_PASSWORD=<your-password>
  ORDER_DATABASE_URL=jdbc:postgresql://<host>:<port>/order_service_db?sslmode=require
  ```

### Step 7: Deploy API Gateway

- [ ] Create new Web Service
- [ ] **Name**: food-api-gateway
- [ ] **Build Command**:
  ```
  cd api-gateway && ../mvnw clean package -DskipTests
  ```
- [ ] **Start Command**:
  ```
  java -jar target/*.jar
  ```
- [ ] **Environment Variables**:
  ```
  PORT=8085
  EUREKA_SERVER_URL=https://discovery-server.onrender.com/eureka/
  USER_SERVICE_URL=https://food-user-service.onrender.com
  RESTAURANT_SERVICE_URL=https://food-restaurant-service.onrender.com
  ORDER_SERVICE_URL=https://food-order-service.onrender.com
  PAYMENT_SERVICE_URL=https://food-payment-service.onrender.com
  DELIVERY_SERVICE_URL=https://food-delivery-service.onrender.com
  FRONTEND_URL=https://your-frontend.vercel.app
  ```
- [ ] Save URL: `https://food-api-gateway.onrender.com`

### Verification

- [ ] All 7 services show "Live" status
- [ ] Test Discovery Server: `https://discovery-server.onrender.com/eureka/web`
- [ ] Test API Gateway health: `https://food-api-gateway.onrender.com/actuator/health`
- [ ] All services appear in Eureka dashboard

---

## Phase 3: Vercel Frontend Deployment (30 minutes)

### Step 1: Configure Vercel Project

- [ ] Go to https://vercel.com/new
- [ ] Import GitHub repository
- [ ] Set **Root Directory** to: `frontend/my-react-app`
- [ ] Verify **Build Command**: `npm install && npm run build`
- [ ] Verify **Output Directory**: `build`

### Step 2: Add Environment Variables

- [ ] Add Environment Variable:
  ```
  REACT_APP_API_BASE_URL = https://food-api-gateway.onrender.com
  ```
- [ ] Select Environments: "Production"

### Step 3: Deploy

- [ ] Click "Deploy"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Save URL: `https://your-project-name.vercel.app`

### Step 4: Update API Gateway CORS

- [ ] Go to Render API Gateway service
- [ ] Update environment variable:
  ```
  FRONTEND_URL=https://your-project-name.vercel.app
  ```
- [ ] Redeploy API Gateway

### Verification

- [ ] Frontend loads without errors
- [ ] Open DevTools (F12)
- [ ] Check Network tab for API calls
- [ ] No CORS errors should appear

---

## Phase 4: End-to-End Testing (1-2 hours)

### Test 1: User Registration

```bash
curl -X POST https://food-api-gateway.onrender.com/user-service/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "userRole": "CUSTOMER"
  }'
```

- [ ] Response status: 200 or 201
- [ ] JWT token received

### Test 2: User Login

```bash
curl -X POST https://food-api-gateway.onrender.com/user-service/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

- [ ] Response status: 200
- [ ] JWT token received

### Test 3: Frontend Registration

- [ ] Open https://your-project-name.vercel.app
- [ ] Navigate to registration
- [ ] Fill in form
- [ ] Click submit
- [ ] Verify success message

### Test 4: Frontend Login

- [ ] Navigate to login
- [ ] Enter registered credentials
- [ ] Click login
- [ ] Verify token stored in localStorage
- [ ] Verify redirected to dashboard

### Test 5: API Gateway Routing

- [ ] Test each service endpoint:
  ```bash
  curl https://food-api-gateway.onrender.com/user-service/api/users
  curl https://food-api-gateway.onrender.com/restaurant-service/api/restaurants
  curl https://food-api-gateway.onrender.com/order-service/api/orders
  curl https://food-api-gateway.onrender.com/payment-service/api/payments
  curl https://food-api-gateway.onrender.com/delivery-service/api/deliveries
  ```
- [ ] All endpoints responding

---

## Phase 5: Post-Deployment Tasks (Optional but Recommended)

### Security

- [ ] Enable HTTPS redirect (Render/Vercel automatic)
- [ ] Set up firewall rules if available
- [ ] Review CORS configuration
- [ ] Verify JWT secret is strong

### Monitoring

- [ ] [ ] Set up error tracking (Sentry)
- [ ] [ ] Configure log aggregation
- [ ] [ ] Set up uptime monitoring (UptimeRobot)
- [ ] [ ] Enable analytics

### Optimization

- [ ] [ ] Enable caching
- [ ] [ ] Compress images on frontend
- [ ] [ ] Minify JavaScript/CSS
- [ ] [ ] Set up CDN

### Database

- [ ] [ ] Configure automated backups
- [ ] [ ] Set up database monitoring
- [ ] [ ] Create backup schedule

### Documentation

- [ ] [ ] Document all service URLs
- [ ] [ ] Document all environment variables
- [ ] [ ] Create runbooks for common issues
- [ ] [ ] Set up incident response procedures

---

## Troubleshooting Quick Links

**Common Issues**:

1. **Services won't start**
   - Check logs in Render
   - Verify environment variables
   - Check database credentials

2. **CORS errors**
   - Update FRONTEND_URL in API Gateway
   - Redeploy API Gateway
   - Clear browser cache

3. **API calls failing**
   - Verify service URLs in API Gateway
   - Check that all services are running
   - Review API Gateway logs

4. **Database connection errors**
   - Verify database credentials
   - Check database URL format
   - Ensure database exists

---

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

## Final Notes

- ✅ All changes are backward compatible
- ✅ Local Docker development still works
- ✅ No business logic changes
- ✅ All features preserved
- ✅ Production-ready configuration

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Notes**: _______________

---

**Last Updated**: May 2024
**Version**: 1.0
