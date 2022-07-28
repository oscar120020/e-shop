import { db } from "."
import { IProduct } from "../interfaces";
import { ProductModel } from "../models";


export const getProductBySlug = async(slug: string): Promise<IProduct | null> => {

    await db.connect();
    const product = await ProductModel.findOne({slug}).lean();
    await db.disconnect();

    
    if(!product){
        return null
    }

    product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    })
    
    return JSON.parse(JSON.stringify(product));
}

export const getProductsSlug = async(): Promise<string[]> => {

    await db.connect();
    const product = await ProductModel.find().select('slug -_id').lean();
    await db.disconnect();
    
    return product.map(product => product.slug);
}

export const getProductsByQuery = async(query: string): Promise<IProduct[]> => {

    query = query.toString().toLocaleLowerCase()
    
    await db.connect();
    const products = await ProductModel.find({ 
        $text: { $search: query } 
    })
    .select('images price title inStock slug -_id')
    .lean();
    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return updatedProducts;
}

export const getAllProducts = async(): Promise<IProduct[]> => {

    await db.connect();
    const products = await ProductModel.find()
    .select('images price title inStock slug -_id')
    .lean();
    await db.disconnect();

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return updatedProducts;
}

