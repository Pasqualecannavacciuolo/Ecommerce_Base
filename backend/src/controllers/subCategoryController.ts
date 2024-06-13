import { Request, Response } from "express";
import prisma from "../prisma";
import { Category, SubCategory } from "@prisma/client";

/**
 * Funzione che ottiene tutte le categorie dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_sub_categories(req: Request, res: Response) {
  try {
    const subCategories = await prisma.subCategory.findMany();
    if (!subCategories) {
      return res.status(404).json({
        message: "Non ci sono sottocategorie nella tabella associata.",
      });
    }
    res.status(200).json(subCategories);
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
export async function get_sub_category_by_id(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const subCategory = await prisma.subCategory.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!subCategory) {
      return res.status(404).json({
        message:
          "Non e' stata trovata nessuna sottocategoria con questo identificativo.",
      });
    }
    res.status(200).json(subCategory);
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
export async function add_sub_category(req: Request, res: Response) {
  const subCategory: SubCategory = req.body;

  try {
    await prisma.subCategory.create({
      data: {
        name: subCategory.name,
      },
    });
    res.status(201).json({ messagge: "Sottocategoria creata con successo" });
  } catch (error) {
    return res
      .status(500)
      .send("Errore durante la creazione della sottocategoria");
  }
}

/**
 * Funzione che modifica lo stato attivo/non attivo di una sottocategoria
 * @param req
 * @param res
 * @returns
 */
export async function modify_status_by_id(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { activeStatus } = req.body;
    const category = await prisma.subCategory.update({
      where: {
        id: id,
      },
      data: {
        active: activeStatus,
      },
    });
    if (!category) {
      return res.status(404).json({
        message:
          "Non e' stata trovata nessuna sottocategoria con questo identificativo.",
      });
    }
    res.status(200).json({
      message: "La sottocategoria e' stata aggiornata con successo.",
    });
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}
