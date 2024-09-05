import { type Request, type Response, type NextFunction } from "express";
import { logger } from "@sve/logger";

export default function customCors(_req: Request, res: Response, next: NextFunction) {
  logger.debug("RES FROM CUSTOM CORS FUNCTION: ", res, '/packages/api/utils', 'cors.ts');
  res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');

  next();
}