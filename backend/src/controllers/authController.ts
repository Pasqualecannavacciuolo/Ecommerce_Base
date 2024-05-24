import { Request, Response } from "express";
import { User } from "../models/User";
import prisma from "../prisma";
import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../lib/hashingHelpers";

const secretKey = process.env.JSONWEBTOKEN_SECRET_KEY!;

/**
 * Funzione per effettuare il login
 * @param req
 * @param res
 * @returns
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    // Trova l'utente nel database utilizzando l'email fornita
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const userObjForJWT = {
      name: user?.name,
      email: user?.email,
    };

    if (!user) {
      return res.status(404).send("Utente non trovato");
    }

    // Verifica se la password fornita corrisponde alla password hashata dell'utente nel database
    const passwordMatch = await verifyPassword(password, user.password);

    if (passwordMatch) {
      const accessToken = jwt.sign({ userObjForJWT }, secretKey, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ userObjForJWT }, secretKey, {
        expiresIn: "1d",
      });

      // Aggiorno access_token & refresh_token nel Database
      await prisma.user.update({
        where: { email: user.email },
        data: { access_token: accessToken, refresh_token: refreshToken },
      });
      return (
        res
          /*.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", accessToken)*/
          .status(200)
          .json({
            token: accessToken,
            email: user.email,
          })
      );
    } else {
      return res.status(401).send("Password errata");
    }
  } catch (error) {
    console.error("Errore durante il login:", error);
    return res
      .status(500)
      .send({ message: "Errore durante il login", status: 500 });
  }
}

/**
 * Funzione per effettuare la registrazione
 * @param req
 * @param res
 */
export async function register(req: Request, res: Response) {
  const user: User = req.body;
  await prisma.user.create({
    data: {
      name: user.name!,
      email: user.email,
      password: await hashPassword(user.password),
    },
  });
  res.status(201).send("Utente registrato con successo");
}

/**
 * Funzione che verifica se jwt e' ancora valido se refreshToken e' ancora vlaido rigenera accessToken
 * @param req
 * @param res
 * @returns
 */
export async function verifyJWT(req: any, res: Response) {
  const { email } = req.body;

  if (!email) {
    res.status(401).send({ message: "Non e' stata fornita nessuna email" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user && user.access_token) {
    try {
      const decoded = jwt.verify(user.access_token, secretKey);
      req.user = decoded;
      return res.status(200).send({
        message: "Access Token risulta ancora valido",
        accessToken: user.access_token,
      });
    } catch (error) {
      // Caso in cui accessToken SCADE
      if (
        error instanceof Error &&
        error.name === "TokenExpiredError" &&
        user.refresh_token
      ) {
        console.log("Access Token scaduto!");
        try {
          const decodedRefreshToken: any = jwt.verify(
            user.refresh_token,
            secretKey
          );
          const userFromToken = decodedRefreshToken.user;
          // Qui dovresti fare altre verifiche sul refresh token se necessario (es. blacklist)
          const newAccessToken = jwt.sign({ userFromToken }, secretKey, {
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
          return res
            .status(200)
            .send({ message: "Access Token rigenerato correttamente" });
        } catch (refreshTokenError) {
          /*const userToSignJWT = {
            name: user.name,
            email: user.email,
          };
          const newAccessToken = jwt.sign({ userToSignJWT }, secretKey, {
            expiresIn: "1h",
          });
          const newRefreshToken = jwt.sign({ userToSignJWT }, secretKey, {
            expiresIn: "1d",
          });
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            },
          });*/
          return res.status(401).send({
            message:
              "Access & Refresh Token sono scaduti, devi accedere nuovamente!",
          });
        }
      }
    }
  } else {
    return res.status(401).send({
      message: "Access token risulta non popolato, devi effettuare l'accesso",
    });
  }
}

/**
 * Funzione che effettua il logout dell'utente
 * @param req
 * @param res
 */
export async function logout(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    res.status(404).send({ message: "Non e' stata fornita nessuna email" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).send({
        message:
          "Non e' stato trovato alcun utente con l'email inserita, Verificare la correttezza dell'email",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        access_token: null,
        refresh_token: null,
      },
    });

    if (!updatedUser) {
      res.status(401).send({
        message: `Non e' stato possibile aggiornare l'utente con email ${email}`,
      });
    }

    res.status(200).send({
      message: `Utente con email ${email} ha effettuato il logout correttamente`,
    });
  } catch (error) {
    console.log(error);
  }
}
