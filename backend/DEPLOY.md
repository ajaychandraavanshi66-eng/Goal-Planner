# Backend Deployment to Render

## Manual Deployment Steps

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select repository: `ajaychandraavanshi66-eng/Goal-Planner`

## Configuration

### Basic Settings
- **Name**: `goal-planner-backend`
- **Region**: Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or Starter if you have payment method)

### Environment Variables

Add these in the Render dashboard under "Environment":

```
PORT=10000
MONGODB_URI=mongodb+srv://ajaykumar2214:ajaykumar2214@cluster0.dthztcy.mongodb.net/goalPlanner?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://goal-planner-h1rb.onrender.com
```

**Important Notes:**
- Render automatically sets `PORT` to `10000` for free tier, but you can override it
- Update `JWT_SECRET` to a strong random string for production
- Update `FRONTEND_URL` to your actual frontend URL after deployment
- The `MONGODB_URI` is already configured in your .env file

### After Deployment

1. Your backend will be available at: `https://goal-planner-backend.onrender.com`
2. Update frontend API URL to point to this backend URL
3. Update `FRONTEND_URL` environment variable in Render to your frontend URL

## Health Check

After deployment, test the health endpoint:
```
GET https://goal-planner-backend.onrender.com/api/health
```

## Troubleshooting

- If build fails, check that `backend/package.json` exists
- If connection fails, verify MongoDB URI is correct
- Check Render logs for detailed error messages

