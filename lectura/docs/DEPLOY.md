# Lectura - Deployment Guide

This guide provides instructions for deploying the Lectura application to a production environment, with a focus on cPanel hosting which is common for many student projects.

## Deployment Overview

The project consists of two main parts that need to be deployed:

1.  **The Node.js Backend:** An Express application that serves the API.
2.  **The React Frontend:** A static single-page application (SPA) that communicates with the backend API.

## Part 1: Deploying the Backend (Node.js)

cPanel provides a "Setup Node.js App" tool that makes this process straightforward.

### Steps:

1.  **Prepare Your Backend Code:**
    *   Ensure all dependencies are listed in `package.json`.
    *   Make sure your `backend/index.js` file is the entry point.
    *   Create a `.npmrc` file in the `backend` directory with the line `scripts-prepend-node-path=true` to help cPanel find the executables.

2.  **Upload Backend Files:**
    *   Zip the contents of the `backend` directory.
    *   In cPanel's File Manager, navigate to the root directory of your domain (e.g., `public_html` or a subdomain folder).
    *   Upload and extract the zipped backend files.

3.  **Create the Node.js Application in cPanel:**
    *   Go to cPanel -> "Setup Node.js App".
    *   Click "Create Application".
    *   **Application Root:** Set this to the path where you extracted your backend files (e.g., `/home/youruser/public_html/backend`).
    *   **Application URL:** Choose the URL where your API will be accessible (e.g., `yourdomain.com/api`). It's highly recommended to run the API on a subdomain like `api.yourdomain.com`.
    *   **Application Startup File:** Set this to `index.js`.
    *   Click "Create".

4.  **Install Dependencies and Run:**
    *   Once the app is created, cPanel will show you a command to install dependencies. It will look like:
        ```bash
        /home/youruser/nodevenv/backend/18/bin/npm install
        ```
        Run this command from the terminal in cPanel or via SSH.
    *   Click "Start App" in the cPanel interface.

5.  **Set Environment Variables:**
    *   In the "Setup Node.js App" interface, scroll down to "Environment Variables".
    *   Add all the necessary production variables from your `.env.example` file:
        *   `NODE_ENV=production`
        *   `PORT` (cPanel usually sets this for you)
        *   `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` (use the credentials for your cPanel MySQL database).
        *   `JWT_SECRET` (use a long, random string).
        *   ...and any other variables.
    *   Save the changes and **Restart** the application from the cPanel interface.

## Part 2: Deploying the Frontend (React)

The React app needs to be "built" into static HTML, CSS, and JS files, which can then be served by any web server.

### Steps:

1.  **Build the Frontend:**
    *   On your local machine, navigate to the `frontend` directory.
    *   Create a `.env.production` file and set the `VITE_API_BASE_URL` to your production backend URL (e.g., `VITE_API_BASE_URL=https://api.yourdomain.com/api`).
    *   Run the build command:
        ```bash
        npm run build
        ```
    *   This will create a `dist` directory inside `frontend`. This `dist` directory contains everything we need to deploy.

2.  **Upload Frontend Files:**
    *   Zip the contents of the `frontend/dist` directory.
    *   In cPanel's File Manager, navigate to the root directory for your main domain (e.g., `public_html`).
    *   Upload and extract the zipped files.

3.  **Configure Redirects for SPA:**
    *   Single-page applications require a server-side redirect rule so that refreshing the page on a route like `/notes` doesn't result in a 404 error.
    *   Create or edit the `.htaccess` file in your `public_html` directory.
    *   Add the following rules:
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteCond %{REQUEST_FILENAME} !-l
          RewriteRule . /index.html [L]
        </IfModule>
        ```

Your application should now be live. The frontend will be accessible at your main domain, and it will make API calls to your backend URL.
