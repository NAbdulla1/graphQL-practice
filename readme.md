# hackernews-node-ts — Quick setup

1. Install dependencies
    ```
    npm install

    npx graphql-codegen
    ```

2. Run Prisma migrations
    - For deploying existing migrations:
      ```
      npx prisma migrate deploy
      ```

3. Start the server
    - Development (with watch/hot-reload):
      ```
      npm run dev
      ```
    - Production:
      ```
      npm start
      ```
    - Or build then start:
      ```
      npm run build && npm start
      ```
