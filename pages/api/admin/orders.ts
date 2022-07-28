import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { OrderModel } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data = 
| { message: string } 
| IOrder[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Validar que el usuario es administrador
  const session: any = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (session.user.role !== "admin") {
    return res.status(401).json({
      message: "No está autorizado para realizar esta acción",
    });
  }
  
  switch (req.method) {
    case "GET":
      return getOrders(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const orders = await OrderModel.find()
    .sort({createdAt: 'desc'})
    .populate('user', 'name email -_id')
    .lean();
  await db.disconnect();

  res.status(200).json(orders);
};
