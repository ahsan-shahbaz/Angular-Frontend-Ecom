---
description: How to set up and deploy the Angular app to Azure Static Web Apps (Free Tier)
---

This workflow guides you through setting up a free Azure Static Web App and connecting it to your GitHub repository.

### Prerequisites
1. An Azure account (you can create one for free).
2. Your code must be pushed to a GitHub repository.

### Step 1: Create the Static Web App in Azure
1. Log in to the [Azure Portal](https://portal.azure.com).
2. In the search bar, type **Static Web Apps** and select it.
3. Click **+ Create**.
4. Fill in the basics:
   - **Subscription**: Select your subscription.
   - **Resource Group**: Create a new one (e.g., `ecommerce-rg`).
   - **Name**: Give your app a name (e.g., `ahsan-ecommerce-frontend`).
   - **Plan type**: Select **Free: For personal projects**.
   - **Region**: Choose the region closest to you.
5. Deployment details:
   - **Source**: Select **GitHub**.
   - **GitHub account**: Authorize Azure if prompted.
   - **Organization/Repository/Branch**: Select your repo and the `main` or `develop` branch.
6. Build details:
   - **Build Presets**: Select **Angular**.
   - **App location**: `/`
   - **Api location**: (Leave empty)
   - **Output location**: `dist/frontend`
7. Click **Review + create**, then **Create**.

### Step 2: Configure Deployment Token (If not using automatic GitHub Action setup)
Azure usually creates the GitHub Action for you. If you want to use the existing workflow in this repo:
1. Once the resource is created, go to the **Overview** page.
2. Click **Manage deployment token**.
3. Copy the token.
4. Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions**.
5. Click **New repository secret**.
6. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`.
7. Value: Paste the token you copied.

### Step 3: Verify Deployment
1. Go to the **Actions** tab in your GitHub repository.
2. You should see a workflow named **Azure Static Web Apps CI/CD** running.
3. Once it finishes, go back to the Azure Portal and click the **URL** on the Overview page to see your live site!
