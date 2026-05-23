# Vercel Frontend Deployment Guide

This guide provides step-by-step instructions for deploying the React frontend to Vercel.

## Prerequisites

1. Vercel account (https://vercel.com)
2. GitHub repository with your code
3. API Gateway URL from Render deployment (e.g., `https://your-api-gateway.onrender.com`)

---

## Deployment Steps

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Paste your GitHub repository URL
4. Click "Continue"
5. Vercel will detect your React project

### Step 2: Configure Project

1. **Project Name**: Enter your desired project name
2. **Framework**: Should auto-detect as "Create React App"
3. **Root Directory**: Set to `frontend/my-react-app`
4. **Build Command**: 
   ```
   npm install && npm run build
   ```
5. **Output Directory**: 
   ```
   build
   ```
6. **Install Command**: 
   ```
   npm install
   ```

### Step 3: Add Environment Variables

Before deploying, add environment variables:

1. Click "Environment Variables"
2. Add the following:

**Production Environment**:
```
REACT_APP_API_BASE_URL = https://your-api-gateway.onrender.com
```

**Preview Deployments** (optional):
```
REACT_APP_API_BASE_URL = https://your-api-gateway.onrender.com
```

**Development** (optional, for local testing):
```
REACT_APP_API_BASE_URL = http://localhost:8085
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (usually 2-5 minutes)
3. Your frontend will be available at `https://your-project-name.vercel.app`

---

## Post-Deployment Configuration

### Step 1: Update API Gateway CORS

After deployment, update the API Gateway to accept requests from your Vercel domain:

1. Go to Render dashboard
2. Select your API Gateway service
3. Update environment variables:
   ```
   FRONTEND_URL=https://your-project-name.vercel.app
   ```
4. Redeploy the API Gateway

### Step 2: Verify Frontend URL

1. Open https://your-project-name.vercel.app in browser
2. Check browser console for any CORS errors
3. Try to register or login to verify API connection

---

## Environment Variable Configuration

### Development (Local)
```
REACT_APP_API_BASE_URL=http://localhost:8085
```

### Production (Vercel)
```
REACT_APP_API_BASE_URL=https://your-api-gateway.onrender.com
```

### How it's Used in Code
```javascript
// frontend/my-react-app/src/api/axiosInstance.js
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8085",
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## Testing the Frontend

### Test 1: API Connection
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try to load a page that makes API calls
4. Verify requests go to your Render API Gateway
5. Check for CORS errors

### Test 2: User Registration
1. Navigate to registration page
2. Fill in form with test data:
   ```
   First Name: John
   Last Name: Doe
   Email: john@example.com
   Password: password123
   Role: Customer
   ```
3. Click Submit
4. Should see success or error message from backend

### Test 3: User Login
1. Navigate to login page
2. Enter credentials from registration
3. Should receive JWT token
4. Token should be stored in localStorage
5. Should be able to access authenticated endpoints

### Test 4: JWT Authentication
1. Open DevTools Console
2. Run:
   ```javascript
   localStorage.getItem("token")
   localStorage.getItem("adminToken")
   localStorage.getItem("customerToken")
   localStorage.getItem("deliveryToken")
   ```
3. Token should exist after login

---

## Troubleshooting

### CORS Errors

**Error**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**:
1. Verify `REACT_APP_API_BASE_URL` is correct
2. Ensure API Gateway has correct `FRONTEND_URL` environment variable
3. Check API Gateway logs for CORS issues
4. Redeploy API Gateway with updated CORS configuration

```properties
# In API Gateway application.properties
spring.web.cors.allowed-origins=${FRONTEND_URL:http://localhost:3000,http://localhost:3001}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

### API Requests Not Working

**Check**:
1. Is the API Gateway running on Render? (Check service logs)
2. Is the API Gateway URL correct?
3. Are all backend services running?
4. Do you see API calls in Network tab of DevTools?

### Page Loads But No Data

**Check**:
1. Open DevTools Console
2. Look for API errors
3. Check Network tab for failed requests
4. Verify backend services are running

### Build Fails on Vercel

**Common Causes**:
1. Missing environment variables
2. Node version incompatibility
3. npm dependency conflicts
4. Syntax errors in code

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies in `package.json` are correct
3. Run `npm install` locally to verify
4. Commit and push fixes to GitHub

---

## Performance Optimization

### Enable Vercel Analytics
1. Go to your project settings on Vercel
2. Enable "Web Analytics"
3. Track performance metrics

### Optimize Images
Vercel automatically optimizes images. No action needed.

### Enable Caching
1. In `next.config.js` or `package.json`
2. Configure cache headers for static assets
3. Vercel handles this automatically for most cases

---

## Custom Domain (Optional)

### Add Custom Domain
1. Go to Vercel project Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records with Vercel's nameservers
5. Wait for DNS propagation (15-48 hours)

### SSL Certificate
Vercel automatically provides free SSL certificates via Let's Encrypt.

---

## Automatic Deployments

### GitHub Integration
1. Vercel automatically deploys when you push to GitHub
2. Each push creates a new deployment
3. You can view deployment history in Vercel dashboard

### Branch Deployments
- `main` branch → Production (https://your-domain.vercel.app)
- Other branches → Preview URLs

### Rollback
1. Go to Vercel Deployments
2. Click the deployment you want to restore
3. Click "Promote to Production"

---

## Monitoring and Logs

### View Logs
1. Go to Vercel project dashboard
2. Click "Deployments"
3. Select a deployment
4. Click "Logs"
5. View build and runtime logs

### Analytics
1. Click "Analytics" in Vercel dashboard
2. View Web Vitals
3. Monitor API requests
4. Track user sessions

---

## Troubleshooting Deployment Issues

### Build Fails with "Cannot find module"
```
npm install
npm run build
```

### Port Issues
- Frontend runs on port 3000 in development
- Vercel hosts on standard HTTPS ports
- No port configuration needed for Vercel

### Environment Variables Not Loading
1. Verify variable names match (case-sensitive)
2. Must start with `REACT_APP_` to be accessible in frontend
3. Redeploy after adding variables
4. Clear browser cache (Ctrl+Shift+Delete)

---

## Security Checklist

- [ ] API Base URL uses HTTPS
- [ ] No sensitive keys in frontend code
- [ ] JWT tokens stored securely in localStorage
- [ ] CORS properly configured
- [ ] API Gateway validates JWT tokens
- [ ] Secrets managed in Vercel environment variables
- [ ] No debug logging of tokens or passwords

---

## Cost

Vercel offers:
- **Free Plan**: Limited deployments, good for development
- **Pro Plan**: $20/month per team member
- **Enterprise**: Custom pricing

For hobby projects, free tier is sufficient.

---

## Next Steps

1. Set up monitoring (Sentry, DataDog)
2. Configure custom domain
3. Set up automated email notifications
4. Implement feature flags for A/B testing
5. Add analytics (Google Analytics)
6. Set up error tracking

---

## Deployment Checklist

- [ ] GitHub repository configured
- [ ] API Gateway URL from Render ready
- [ ] Environment variables configured in Vercel
- [ ] Build command verified
- [ ] Frontend deploys successfully
- [ ] API calls working from frontend
- [ ] JWT authentication working
- [ ] All pages loading correctly
- [ ] No CORS errors
- [ ] Tests passing locally before deployment

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Documentation**: https://vercel.com/docs
- **React Documentation**: https://react.dev
- **Axios Documentation**: https://axios-http.com

---

**Last Updated**: May 2024
**Version**: 1.0
