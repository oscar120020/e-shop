import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { UserModel } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";

type Data = { message: string } | IUser[];

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
      return getUsers(req, res);
    case "PUT":
      return updateUsers(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await UserModel.find().select("-password").lean();
  await db.disconnect();

  res.status(200).json(users);
};

const updateUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userId = "", role = "" } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "User Id invalido" });
  }

  const validRoles = ["client", "admin"];
  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: "Rol no permitido" + validRoles.join(", ") });
  }

  await db.connect();
  const dbUser = await UserModel.findById(userId);

  if(!dbUser){
    await db.disconnect();
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  dbUser.role = role;
  await dbUser.save();
  await db.disconnect();

  return res.status(200).json({ message: 'Usuario actualizado' })

};
