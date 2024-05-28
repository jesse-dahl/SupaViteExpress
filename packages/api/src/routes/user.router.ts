import express, { type Request, type Response, type Router } from "express"

const userRouter: Router = express.Router()

userRouter.get("/", (_req: Request, res: Response) => {
  res.send({ data: "User router is ripping and good to go!" }).status(200)
})

userRouter.get("/users", (_req: Request, res: Response) => {
  res.send("Hiiiii").status(200)
})

export default userRouter