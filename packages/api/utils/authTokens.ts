import * as jwt from "jsonwebtoken"
import { User } from "@sve/db/types"
import { getUser } from "@sve/db/queries/users"
import { Response } from "express";
import { SERVER_ENV } from "@sve/env";  

export type RefreshTokenData = {
  userId: string;
  refreshTokenVersion?: number;
};

export type AccessTokenData = {
  userId: string;
};

const __prod__ = SERVER_ENV.NODE_ENV === "production"

const createAuthTokens = (
  user: User
): { refreshToken: string; accessToken: string } => {
  const refreshToken = jwt.sign(
    { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    SERVER_ENV.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    { userId: user.id },
    SERVER_ENV.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15min",
    }
  );

  return { refreshToken, accessToken };
};

const cookieOpts = {
  httpOnly: true,
  secure: __prod__,
  sameSite: "lax",
  path: "/",
  domain: __prod__ ? `.${SERVER_ENV.DOMAIN}` : "",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
} as const;

export const sendAuthCookies = (res: Response, user: User) => {
  const { accessToken, refreshToken } = createAuthTokens(user);
  res.cookie("id", accessToken, cookieOpts);
  res.cookie("rid", refreshToken, cookieOpts);
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("id", cookieOpts);
  res.clearCookie("rid", cookieOpts);
};

export const checkTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    // verify
    const data = <AccessTokenData>(
      jwt.verify(accessToken, SERVER_ENV.ACCESS_TOKEN_SECRET!)
    );

    // get userId from token data
    return {
      userId: data.userId,
    };
  } catch {
    // token is expired or signed with a different secret
    // so now check refresh token
  }

  if (!refreshToken) {
    throw new Error("UNAUTHORIZED");
  }

  // 1. verify refresh token
  let data;
  try {
    data = <RefreshTokenData>(
      jwt.verify(refreshToken, SERVER_ENV.REFRESH_TOKEN_SECRET!)
    );
  } catch {
    throw new Error("UNAUTHORIZED");
  }

  // 2. get user
  const user = await getUser(data.userId) as User;

  // 3.check refresh token version
  if (!user || user.refreshTokenVersion !== data.refreshTokenVersion) {
    throw new Error("UNAUTHORIZED");
  }
  return {
    userId: data.userId,
    user,
  };
};