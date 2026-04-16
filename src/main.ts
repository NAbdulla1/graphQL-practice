import { config } from "./config";
import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { schema } from "./schema";
import { createContext } from "./context";
import { configurePassport } from "./auth";
import { RedisStore } from "connect-redis";
import { redis } from "./redis";

function main() {
  const app = express();

  // 1. Configure Passport
  configurePassport();

  // 2. Middlewares
  app.use(
    cors({
      origin: config.FRONTEND_URL,
      credentials: true,
    })

  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. Session with Redis Store
  app.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: "hn:",
      }),
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.FRONTEND_URL.startsWith("https"),
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },

    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // 3. GraphQL Yoga
  const yoga = createYoga({
    schema,
    context: createContext,
    graphqlEndpoint: "/graphql",
    cors: false, // Let Express handle CORS
  });

  // 4. Auth Routes
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login-failed" }),
    (req, res) => {
      // Explicitly save the session before redirecting to ensure the store is updated
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.redirect("/login-failed");
        }
        res.redirect(config.FRONTEND_URL);
      });
    }
  );

  app.post("/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out" });
    });
  });

  // 5. Mount Yoga
  app.use(yoga.graphqlEndpoint, (req, res) =>
    yoga.handle(req, res));

  // 6. Serve Frontend in Production
  if (config.NODE_ENV === "production" || config.NODE_ENV === "stage") {
    // In production, we assume the frontend is in a 'frontend' subfolder relative to this file
    const frontendPath = path.resolve(__dirname, "frontend");
    app.use(express.static(frontendPath));

    // Catch-all route for SPA
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  }

  const server = createServer(app);
  server.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
    console.log(`GraphQL Endpoint: http://localhost:${config.PORT}/graphql`);
    console.log(`Google Login: http://localhost:${config.PORT}/auth/google`);
  });
}

main();
