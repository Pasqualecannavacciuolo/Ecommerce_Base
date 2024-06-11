import { Request, Response } from "express";
import prisma from "../prisma";
import { Category } from "@prisma/client";

/**
 * Funzione che ottiene tutte le categorie dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_categories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany();
    if (!categories) {
      return res.status(404).json({
        message: "Non ci sono categorie nella tabella associata.",
      });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che ottiene la categoria tramite l'ID dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_category_by_id(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!category) {
      return res.status(404).json({
        message:
          "Non e' stata trovata nessuna categoria con questo identificativo.",
      });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che aggiunge una categoria al Database
 * @param req
 * @param res
 * @returns
 */
export async function add_category(req: Request, res: Response) {
  const category: Category = req.body;

  try {
    await prisma.category.create({
      data: {
        name: category.name,
      },
    });
    res.status(201).json({ messagge: "Categoria creata con successo" });
  } catch (error) {
    return res.status(500).send("Errore durante la creazione della categoria");
  }
}
