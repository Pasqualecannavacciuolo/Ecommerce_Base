import { Request, Response } from "express";
import prisma from "../prisma";

export async function get_user(req: Request, res: Response) {
  const { id } = req.body;

  if (!id) {
    res.status(404).send({ message: "Nessun ID e' stato fornito" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        name: true,
        email: true,
      },
    });
    if (!user) {
      res.status(404).send({
        message: "Nessun utente e' stato trovato con questo identificativo",
      });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}
