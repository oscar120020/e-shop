import { db } from ".";
import { UserModel } from "../models";
import bcrypt from "bcryptjs";

export const checkUserEmailPassword = async (email = "", password = "") => {
  await db.connect();
  const user = await UserModel.findOne({ email });
  await db.disconnect();

  if (!user) return null;

  if (!bcrypt.compareSync(password, user.password!)) return null;

  const { _id, name, role } = user;

  return {
    _id,
    name,
    role,
    email: email.toLocaleLowerCase(),
  };
};

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {

  await db.connect();
  const user = await UserModel.findOne({ email: oAuthEmail });

  if (user) {
    await db.disconnect();
    const { _id, name, role, email } = user;
    return { _id, name, role, email };
  }

  const newUser = new UserModel({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    role: "client",
  });

  await newUser.save();
  await db.disconnect();
    
  const { _id, name, role, email } = newUser;
  return { _id, name, role, email };
};
