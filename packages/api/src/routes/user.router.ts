import { User } from "@sve/db/types"
import express, { NextFunction, type Request, type Response, type Router } from "express"
import { authenticateJWT } from "../../middleware/auth"
import { checkTokens } from "../../utils/authTokens"
import { userQueries } from "@sve/db"

const userRouter: Router = express.Router()

userRouter.get("/", (_req: Request, res: Response) => {
  res.send({ data: "User router is ripping and good to go!" }).status(200)
})

userRouter.get("/users", (_req: Request, res: Response) => {
  res.send("Hiiiii").status(200)
})

userRouter.get("/users/:id", async (req: Request, _res: Response) => {
  const { id, rid } = req.cookies;
  let user: User | null | undefined = null;

  try {
    const { userId, user: maybeUser } = await checkTokens(id, rid);
    if (maybeUser) {
      user = maybeUser;
    } else {
      user = await userQueries.getUser(userId);
    }

    return { user };
  } catch (e) {
    return { user: null };
  }
})

// Protected route
userRouter.get('/secure-route', authenticateJWT, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Your secure route logic here
    res.json({ message: 'Access Granted' });
  } catch (error) {
    next(error);
  }
});

export default userRouter