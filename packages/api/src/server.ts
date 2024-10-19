import express, { type Express, type Request, type Response } from "express"
import passport from "passport";
import { OAuth2Strategy } from "passport-google-oauth"
import cookieParser from "cookie-parser"
import { SERVER_ENV } from "@sve/env";
import cors from "cors"
// import customCors from "../utils/cors"
import userRouter from "./routes/user.router"
import authRouter from "./routes/auth.router"
import { User } from "@sve/db/types";
import { userQueries } from "@sve/db";
import { userMutations } from "@sve/db";
import { logger } from "@sve/logger";


const PORT = 5001;
export const app: Express = express();
let server: ReturnType<express.Application['listen']>;;

export function initApp() {
  initAppMiddleware()
  initAppRouters()
  startAppServer()
}

function initAuth() {
  app.use(passport.initialize() as any);

  const clientID = SERVER_ENV.GOOGLE_CLIENT_ID;
  const clientSecret = SERVER_ENV.GOOGLE_CLIENT_SECRET;
  const callbackURL = `${SERVER_ENV.API_URL}/auth/google/redirect`;

  if (!clientID || !clientSecret) {
    throw new Error("Google OAuth client ID and secret must be defined");
  }

  passport.use(
    new OAuth2Strategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async function (_accessToken, _refreshToken, profile, done) {
        // User find or create to db
        const userData = profile._json;
        // 2. db lookup
        let user = await userQueries.getUser(userData?.id)

        // 3. create user if not exists
        if (!user) {
          [user] = await userMutations.insertUser({
            googleId: userData?.id,
          })
        }

        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => { 
    done(null, user); 
  }); 
  
  passport.deserializeUser((user: User, done) => { 
    done(null, user);
  }); 
}

function initAppMiddleware() {
  logger.debug("MIDDLEWARE INIT");
  app.use(cors({
    credentials: true,
    allowedHeaders: 'Content-Type,X-Requested-With,Authorization'
  }));
  app.use(function(_req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
  });
  initAuth();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
}

function initAppRouters() {
  logger.debug("APP ROUTER INIT");
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).send({ data: "Express server is ripping and good to go!" })
  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
}

function startAppServer() {
  server = app.listen(PORT, () => logger.debug(`Server listening on port : ${PORT}`));
}

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
});