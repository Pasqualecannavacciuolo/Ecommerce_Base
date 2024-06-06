import { Request, Response } from "express";
import prisma from "../prisma";
import { Product } from "../models/Product";

/**
 * Funzione che ottiene tutti i prodotti dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_products(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che aggiunge un prodotto al Database
 * @param req
 * @param res
 * @returns
 */
export async function add_product(req: Request, res: Response) {
  const product: Product = req.body;

  try {
    await prisma.product.create({
      data: {
        product_name: product.product_name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
    });
    res.status(201).json({ messagge: "Prodotto creato con successo" });
  } catch (error) {
    return res.status(500).send("Errore durante la creazione del prodotto");
  }
}
