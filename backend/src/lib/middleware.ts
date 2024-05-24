import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "..";
import prisma from "../prisma";

export const authenticate = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.headers["authorization"];
  const refresh_token = req.cookies.refreshToken;

  if (!access_token && !refresh_token) {
    return res
      .status(401)
      .send("Accesso Negato. Non e' stato dato nessun token come input.");
  }

  try {
    const decoded = jwt.verify(access_token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    // Caso in cui accessToken SCADE
    if (
      error instanceof Error &&
      error.name === "TokenExpiredError" &&
      refresh_token
    ) {
      console.log("Access Token scaduto!");
      try {
        const decodedRefreshToken: any = jwt.verify(refresh_token, secretKey);
        const user = decodedRefreshToken.user;
        // Qui dovresti fare altre verifiche sul refresh token se necessario (es. blacklist)
        const newAccessToken = jwt.sign({ user }, secretKey, {
          expiresIn: "1h",
        });
        req.user = decodedRefreshToken;
        await prisma.user.update({
          where: {
            id: decodedRefreshToken.user.id,
          },
          data: {
            access_token: newAccessToken,
          },
        });
        req.headers["Authorization"] = `${newAccessToken}`;
        next();
      } catch (refreshTokenError) {
        return res.status(401).send("Refresh token scaduto o non valido");
      }
    }
  }
};
