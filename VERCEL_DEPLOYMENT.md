# Vercel Deployment Guide

This application is split into two parts: the Vite Frontend and the Express Backend. You will deploy them as two separate projects on Vercel.

## 1. Deploying the Backend (API & Vercel KV)

1. **Push your code to GitHub.**
2. **Go to Vercel dashboard** and click **"Add New Project"**.
3. Select your repository.
4. In the **"Framework Preset"**, select **"Other"**.
5. Set the **"Root Directory"** to `backend`.
6. Click **Deploy**.

### Setting up Vercel KV (Database)
Because Vercel functions are stateless and read-only, we use Vercel KV to store the `problems.json` data.

1. Once the backend is deployed, go to the project in Vercel.
2. Click the **"Storage"** tab.
3. Click **"Create Database"** and select **"KV (Redis)"**.
4. Accept the defaults and create the database.
5. Vercel will automatically add the required environment variables (`KV_REST_API_URL` and `KV_REST_API_TOKEN`) to your backend project. 
6. **Important:** Go to the Deployments tab and click "Redeploy" so the backend picks up the new KV environment variables.

### Getting your Backend URL
Once deployed, copy the production URL of your backend (it will look like `https://leetcode-tracker-backend.vercel.app`). You need this for the frontend!

---

## 2. Deploying the Frontend

1. **Go to Vercel dashboard** and click **"Add New Project"**.
2. Select the same repository again.
3. In the **"Framework Preset"**, select **"Vite"**.
4. Set the **"Root Directory"** to `frontend`.
5. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `[Paste your backend URL from the previous step]` (e.g., `https://leetcode-tracker-backend.vercel.app`)
6. Click **Deploy**.

**You're Done!** 
Visit your frontend Vercel URL. You can upload an Excel/CSV file to manage problems, and it will be securely and permanently saved to your Vercel KV database.
