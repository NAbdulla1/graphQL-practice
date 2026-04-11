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
    npx graphql-codegen
    ```

5. **Start the server**
    ```cmd
    npm run dev
    ```

---

## Authentication Features

- **Google SSO**: Log in with any personal Gmail account.
- **Strict Security**: All mutations (posting links, comments, deleting) require an active session.
- **Ownership**: Users can only delete links that they themselves posted.
- **Session-based**: Uses `express-session` with secure cookies.
