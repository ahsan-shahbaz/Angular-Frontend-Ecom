# Deployment Guide

This document provides instructions on how to build and deploy the Angular frontend application.

## Local Build

To create a production-ready build locally, follow these steps:

1.  **Install Dependencies**:
    Ensure all node modules are installed.
    ```bash
    npm install
    ```

2.  **Generate Production Build**:
    Run the build command to generate the static files.
    ```bash
    npm run build
    ```
    The build artifacts will be stored in the `dist/frontend` directory.

## Azure Static Web Apps Deployment

Azure Static Web Apps is a great way to host your Angular app for free.

### Automated Deployment via GitHub Actions

1.  **Create an Azure Static Web App**:
    - Go to the [Azure Portal](https://portal.azure.com).
    - Search for "Static Web Apps" and create a new one.
    - Choose the "Free" plan.
    - Select "GitHub" as the source and authorize Azure to access your repositories.
    - Select your repository and the branch (e.g., `main` or `develop`).

2.  **Configure Build Details**:
    - Build Preset: `Angular`
    - App location: `/`
    - Api location: (leave empty if no backend in this repo)
    - Output location: `dist/frontend`

3.  **Deployment Token**:
    Azure will automatically add a GitHub Action workflow file to your repository. If you are creating it manually (like the one provided in `.github/workflows/azure-static-web-apps.yml`), you will need to:
    - Go to the Azure Static Web App resource in the portal.
    - Click "Manage deployment token".
    - Copy the token.
    - In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
    - Add a new repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN` and paste the token.

### Manual Setup of GitHub Workflow

If you want to use the provided workflow:

- Ensure the file `.github/workflows/azure-static-web-apps.yml` exists in your repository.
- Make sure the `app_location` and `output_location` match your project structure.
- The workflow is currently configured to trigger on pushes to `main` and `develop`.
