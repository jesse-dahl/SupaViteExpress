import express, { type Express, type Request, type Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
// import customCors from "../utils/cors"
import userRouter from "./routes/user.router"
import authRouter from "./routes/auth.router"
require('dotenv').config({ path: "../../../.env" })


const PORT = 5001;
export const app: Express = express();

export function initApp() {
  initAppMiddleware()
  initAppRouters()
  startAppServer()
}

function initAppMiddleware() {
  console.log("MIDDLEWARE INIT")
  app.use(cors({
    credentials: true,
    allowedHeaders: 'Content-Type,X-Requested-With,Authorization'
  }))
  app.use(function(_req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
  });
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cookieParser())
}

function initAppRouters() {
  console.log("APP ROUTER INIT")
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).send({ data: "Express server is ripping and good to go!" })
  })

  app.use("/auth", authRouter)
  app.use("/user", userRouter)
}

function startAppServer() {
  app.listen(PORT, () => console.log(`Server listening on port : ${PORT}`));
}


