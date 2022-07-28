import axios from "axios";
import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../database";
import { PaypalOrderResponse } from "../../../interfaces";
import { OrderModel } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      res.status(400).json({ message: "Bad Request" });
  }
}

const getPaypalAccessToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { transactionId = "", orderId = "" } = req.body;

  // Verify Session
  const session: any = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autenticado" });
  }


  // Validate MongoId
  if (!isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Order Id no válido" });
  }


  // Get Paypal Token
  const paypalToken = await getPaypalAccessToken();
  if (!paypalToken) {
    res.status(400).json({ message: "No se pudo generar el token de acceso" });
  }


  // Verify Order Status
  const { data } = await axios.get<PaypalOrderResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalToken}`,
      },
    }
  );
  if (data.status !== "COMPLETED") {
    return res.status(401).json({ message: "Oreden no reconocisa" });
  }


  // Verify Order In Our DB
  await db.connect();
  const dbOrder = await OrderModel.findById(orderId);

  if (!dbOrder) {
    await db.disconnect();
    return res
      .status(400)
      .json({ message: "Oreden no existe en nuestra base de datos" });
  }

  if (
    dbOrder.orderSummary.total.toFixed(2) !==
    data.purchase_units[0].amount.value
  ) {
    
    await db.disconnect();
    return res
      .status(400)
      .json({
        message: "El monto de Paypal y el de nuestra orden no son iguales",
      });
  }
  

  // Complete Order
  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;

  await dbOrder.save();
  await db.disconnect();

  res.status(200).json({ message: "Orden pagada" });
};
