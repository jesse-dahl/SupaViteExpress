import { User } from "@supaviteexpress/db";
import { checkTokens } from "../utils/authTokens";
import { Request as ExpressRequest, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends ExpressRequest {
  userId: string;
  user: User; // Replace 'any' with the actual user type
}

// Middleware for validating JWT tokens
export const authenticateJWT = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  const { id, rid } = req.cookies
  if (!id || !rid) return res.status(401).json({ message: 'Unauthorized' });

  const { userId, user } = await checkTokens(id, rid);
  if (!userId || !user) return res.status(401).json({ message: 'Unauthorized' });
  req.user = user;
  next();
};

// implement at some point
// export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
//   if (req.user && req.user.role === 'admin') {
//     return next();
//   }
//   res.status(403).json({ message: 'Admin access required' });
// };