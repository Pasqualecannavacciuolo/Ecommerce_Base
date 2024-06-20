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
        category: true,
        sub_category: true,
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
        variants: product.variants ? product.variants : "",
        status: product.status,
        category: product.category,
        sub_category: product.sub_category,
        price: product.price ? product.price : 0,
        stock: product.stock ? product.stock : 0,
      },
    });
    res.status(201).json({ messagge: "Prodotto creato con successo" });
  } catch (error) {
    return res.status(500).send("Errore durante la creazione del prodotto");
  }
}

/**
 * Funzione che modifica un prodotto
 * @param req
 * @param res
 * @returns
 */
export async function modify_product_by_id(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const productFromBody: Product = req.body;
  try {
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        product_name: productFromBody.product_name,
        description: productFromBody.description,
        variants: productFromBody.variants ? productFromBody.variants : "",
        price: productFromBody.price ? productFromBody.price : 0,
        stock: productFromBody.stock ? productFromBody.stock : 0,
        status: productFromBody.status,
        category: productFromBody.category,
        sub_category: productFromBody.sub_category,
      },
    });
    if (!product) {
      return res.status(404).json({
        message:
          "Non e' stata trovata nessun prodotto con questo identificativo.",
      });
    }
    res.status(200).json({
      message: "Il prodotto e' stato aggiornato con successo.",
    });
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}
