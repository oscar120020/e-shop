import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { IOrder } from "../../../interfaces";
import { db } from "../../../database";
import { OrderModel, ProductModel } from "../../../models";

type Data = { message: string } | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      res.status(400).json({ message: "Endpoint no disponible" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, orderSummary } = req.body as IOrder;
  const session: any = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const productsIds = orderItems.map((p) => p._id);

  await db.connect();
  const dbProducts = await ProductModel.find({
    _id: { $in: productsIds },
  });
  

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((prod) => prod.id === current._id)?.price;

      if (!currentPrice) {
        throw new Error(
          "Verificar el carrito de compras, el producto no existe"
        );
      }
      return currentPrice * current.quantity + prev;
    }, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backTotal = subTotal * (taxRate + 1);

    if(backTotal !== orderSummary.total){
        throw new Error("Los precios de los productos no concuerdan")
    }

    const userId = session.user._id;
    const newOrder = new OrderModel({
        ...req.body,
        isPaid: false,
        user: userId
    })

    newOrder.orderSummary.total = Number(newOrder.orderSummary.total.toFixed(2));

    await newOrder.save()
    await db.disconnect();

    res.status(201).json(newOrder);

  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: error.message || "Revise logs del servidor" });
  }
};
