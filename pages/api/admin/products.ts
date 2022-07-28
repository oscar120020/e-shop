import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { ProductModel } from "../../../models";
import { authOptions } from "../auth/[...nextauth]";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data = { message: string } | IProduct[] | IProduct;

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
      return getProducts(req, res);

    case "POST":
      return saveProduct(req, res);

    case "PUT":
      return updateProduct(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await ProductModel.find().sort({ title: "asc" }).lean();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });

    return product;
  });

  res.status(200).json(updatedProducts);
};

const saveProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Es necesario al menos 2 imágenes" });
  }

  try {
    await db.connect();
    const dbProduct = await ProductModel.findOne({ slug: req.body.slug });

    if (dbProduct) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese slug" });
    }

    const product = new ProductModel(req.body);
    await product.save();
    await db.disconnect();

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res
      .status(400)
      .json({ message: "Error al crear producto - Revisar logs del servidor" });
  }
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "Id no es válido" });
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Es necesario al menos 2 imágenes" });
  }

  try {
    await db.connect();
    const product = await ProductModel.findById(_id);

    if (!product) {
      await db.disconnect();
      return res
        .status(404)
        .json({ message: "El producto no existe en nuestra DB" });
    }
    
    product.images.forEach(async (image) => {
      const [fileId, extension] = image
        .substring(image.lastIndexOf("/") + 1)
        .split(".");
      cloudinary.uploader.destroy(fileId);
    });

    await product.update(req.body, { new: true });
    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res
      .status(400)
      .json({
        message: "Error al actualizar producto - Revisar logs del servidor",
      });
  }
};
