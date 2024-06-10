import { Request, Response } from "express";
import prisma from "../prisma";
import { Product } from "@prisma/client";

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
 * Funzione che ottiene il prodotto tramite l'ID dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_product_by_id(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        product_name: true,
        description: true,
        status: true,
        price: true,
        stock: true,
        variants: true,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che ottiene tutti i prodotti attivi dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_products_attivi(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "Attivo",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che ottiene tutti i prodotti in stato di bozza dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_products_bozze(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "Bozza",
      },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che ottiene tutti i prodotti archiviati dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_products_archiviati(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "Archiviato",
      },
    });
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
