import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { UserModel } from "../../../models";
import bcrypt from "bcryptjs";
import { IUser } from "../../../interfaces";
import { jwt, validations } from "../../../helpers";

type Data =
  | { message: string }
  | {
      user: {
        name: string;
        email: string;
        role: string;
      };
      token: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return register(req, res);

    default:
      res.status(404).json({ message: "Endpoint no disponible" });
  }
}

const register = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    name = "",
    email = "",
    password = "",
  } = req.body as { name: string; email: string; password: string };

  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: "El nombre debe de ser de 2 caracteres o más" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "La contraseña debe de ser de 6 caracteres o más" });
  }

  if (!validations.isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "El email no es válido" });
  }

  await db.connect();
  const user = await UserModel.findOne({ email }).lean();

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: "Este email ya está registrado" });
  }

  const newUser = new UserModel({
    name,
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
  });
  try {
    await newUser.save();
    await db.disconnect();
  } catch (error) {
    return res.status(500).json({ message: "Revisar logs del servidor" });
  }

  const { _id } = newUser;

  const token = jwt.signToken(_id, email);

  res.status(201).json({
      user: {email, name, role: 'client'},
      token
  })
};
