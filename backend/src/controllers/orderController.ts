import { Request, Response } from "express";
import prisma from "../prisma";

/**
 * Funzione che ottiene tutti i prodotti dal database
 * @param req
 * @param res
 * @returns
 */
export async function get_all_orders(req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                product_name: true,
                description: true,
                price: true,
              },
            },
          },
        },
      },
      take: 10, // Prendo solo gli ultimi 10 ordini
    });
    res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send("Errore durante il fetch dei dati");
  }
}

/**
 * Funzione che aggiunge un prodotto al Database
 * @param req
 * @param res
 * @returns
 */
export async function add_order(req: Request, res: Response) {
  interface ProductFromJson {
    productId: number;
    quantity: number;
  }

  try {
    const { userId, status, products } = req.body;

    // Trova l'utente nel database
    const foundedUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Controlla se tutti gli ID dei prodotti sono validi
    if (!foundedUser) {
      return res
        .status(404)
        .json({ error: "Utente non presente nel database" });
    }

    // Verifica che la quantità e l'ID del prodotto siano presenti per tutti i prodotti
    const missingFieldsProducts = products.filter(
      (product: any) => !product.quantity || !product.productId
    );
    if (missingFieldsProducts.length > 0) {
      return res.status(400).json({
        error:
          "Verifica che tutti i prodotti abbiano specificato un productID e la quantita",
      });
    }

    // Verifica che la quantità ordinata sia maggiore di zero per tutti i prodotti
    if (products.some((product: any) => product.quantity <= 0)) {
      return res.status(400).json({
        error:
          "La quantità ordinata deve essere maggiore di zero per tutti i prodotti.",
      });
    }

    // Verifica che l'ID del prodotto esista nel database per tutti i prodotti
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: products.map((product: any) => product.productId) },
      },
    });
    const existingProductIds = existingProducts.map((product) => product.id);
    const missingProductIds = products
      .filter((product: any) => !existingProductIds.includes(product.productId))
      .map((product: any) => product.productId);
    if (missingProductIds.length > 0) {
      return res.status(400).json({
        error: `I seguenti ID prodotto non esistono nel database: ${missingProductIds.join(
          ", "
        )}.`,
      });
    }

    // Calcola il totale dell'ordine
    let orderTotal = 0;
    for (const productInfo of products) {
      const product = existingProducts.find(
        (p) => p.id === productInfo.productId
      );
      if (product) {
        orderTotal += product.price * productInfo.quantity;
      }
    }

    // Creazione dell'ordine con il totale
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        status,
        total: orderTotal, // Aggiungi il totale nell'oggetto data
        products: {
          create: products.map((productInfo: ProductFromJson) => ({
            product: { connect: { id: productInfo.productId } },
            quantity: productInfo.quantity,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // Aggiornamento dello stock dei prodotti
    for (const productInfo of products) {
      const { productId, quantity: orderedQuantity } = productInfo;
      await prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: orderedQuantity,
          },
        },
      });
    }

    res.status(201).json({
      message: "Ordine creato con successo.",
      order: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Impossibile creare l'ordine" });
  }
}
