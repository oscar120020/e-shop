import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../database";
import { DashboardData } from "../../../interfaces";
import { OrderModel, ProductModel, UserModel } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data = { message: string } | DashboardData;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getDashboardInfo(req, res);

    default:
      return res.status(400).json({ message: "Enpoint no disponible" });
  }
}

const getDashboardInfo = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  // Validar que el usuario es administrador
  const session: any = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (session.user.role !== "admin") {
    return res.status(401).json({ 
      message: "No está autorizado para realizar esta acción" 
    });
  }

  await db.connect();
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    OrderModel.count(),
    OrderModel.find({ isPaid: true }).count(),
    UserModel.find({ role: "client" }).count(),
    ProductModel.count(),
    ProductModel.find({ inStock: 0 }).count(),
    ProductModel.find({ inStock: { $lte: 10 } }).count(),
  ]);
  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
};
