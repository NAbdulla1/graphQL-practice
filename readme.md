# hackernews-node-ts

A GraphQL-based HackerNews clone with Google OAuth 2.0 authentication.

## Quick Setup

1. **Install dependencies**
    ```cmd
    npm install
    ```

2. **Configure Environment Variables**
    Copy `.env-example` to `.env.development` and fill in your credentials.
    ```cmd
    copy .env-example .env.development
    ```

3. **Google OAuth 2.0 Setup**
    1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
    2. Create a new project.
    3. Navigate to **APIs & Services > OAuth consent screen**.
       - Select **External**.
       - Fill in the required App name, user support email, and developer contact info.
    4. Navigate to **Credentials**.
       - Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
       - Application type: **Web application**.
       - Name: `HackerNews GraphQL App`.
       - Authorized redirect URIs: `http://localhost:4000/auth/google/callback`.
       - Click **Create**.
    5. Copy your **Client ID** and **Client Secret** into the `.env` file.

4. **Database & Types**
    ```cmd
    npx prisma generate
    npx prisma migrate deploy
    npx graphql-codegen
    ```

5. **Start the server**
    ```cmd
    npm run dev
    ```

6. **Create migration and apply**
    ```cmd
    npx prisma migrate dev --create-only
    npx prisma migrate deploy
    ```

    or create and deploy at the same time
    ```cmd
    npx prisma migrate dev --name <name-of-migration>
    ```

---

## Authentication Features

- **Google SSO**: Log in with any personal Gmail account.
- **Strict Security**: All mutations (posting links, comments, deleting) require an active session.
- **Ownership**: Users can only delete links that they themselves posted.
- **Session-based**: Uses `express-session` with secure cookies.

---

## Production Build & Deployment

To build and run the application in production mode:

1. **Build the entire project**
    ```cmd
    npm run build
    ```
    This command builds both the backend (via `tsc`) and the frontend (via `vite`), placing the results in the `dist/` directory.

2. **Configure Production Environment**
    Ensure `.env.production` is correctly set up with production URLs (e.g., `PORT=3000`, `FRONTEND_URL=http://localhost:3000`).

3. **Start the Production Server**
    ```cmd
    npm run start-production
    ```
    The backend will now serve the compiled frontend as static files from `dist/frontend` and handle all SPA routing using a regex-based catch-all route.

---

## IIS Hosting (Windows Server)

To host this application on IIS, follow these steps:

### Prerequisites
1.  **IISnode**: [Install iisnode for IIS](https://github.com/azure/iisnode).
2.  **URL Rewrite**: [Install URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite).
3.  **Redis**: Ensure Redis is running on localhost (default) or update `REDIS_URL` in `.env.production`.

### Step-by-Step Deployment

1.  **Build the Production Package**
    ```cmd
    npm run build-production
    ```
    This creates a self-contained `dist` directory with all necessary files (`web.config`, `.env.production`, `prisma/`, etc.).

2.  **Configure IIS**
    - Open **IIS Manager**.
    - Right-click **Sites** > **Add Website**.
    - **Physical path**: Point this to the `dist` directory of your project.
    - **Port**: Set your desired port (e.g., 80 or 8080).

3.  **Install Production Dependencies**
    Navigate to the `dist` folder on your server and run:
    ```cmd
    npm install --omit=dev
    ```

4.  **Permissions**
    The **IIS AppPool** user (e.g., `IIS AppPool\YourSiteName`) must have the correct permissions to run the app and write to the database:

    **For the `dist` folder (Read access):**
    - Right-click `dist` > **Properties** > **Security** > **Edit**.
    - Click **Add**, type `IIS AppPool\YourSiteName`, and click **Check Names**.
    - Ensure **Read & execute**, **List folder contents**, and **Read** are checked.
    - Click **OK**.

    **For the `dist/prisma` folder (Write access for SQLite):**
    - Right-click the `prisma` folder inside `dist` > **Properties** > **Security** > **Edit**.
    - Select the same AppPool user.
    - Check the **Modify** box (allows SQLite to create/write the `dev.db` file).
    - Click **OK**.

5.  **Database Migration**
    If using a fresh database, run prisma migrations from the `dist` folder:
    ```cmd
    npx prisma migrate deploy
    ```

### Troubleshooting
- **Logs**: Check the `iisnode` folder created inside `dist` for stdout/stderr logs.
- **Node Path**: If `node.exe` is not in your PATH, update the `nodeProcessCommandLine` in `web.config`.
- **Named Pipes**: The backend is configured to automatically detect if it's running under IIS and use the provided named pipe instead of a numeric port.
