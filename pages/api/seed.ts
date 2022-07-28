import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database';
import { OrderModel, ProductModel, UserModel } from '../../models';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if(process.env.NODE_ENV !== 'development') {
        return res.status(401).json({message: "No está autorizado para realizar esta acción"})
    }


    switch (req.method) {
        case 'PATCH':
            return loadSeedData(req, res);
    
        default:
            res.status(400).json({ message: 'Endpoint no disponible' })
    }
}

const loadSeedData = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await db.connect();

    await UserModel.deleteMany();
    await UserModel.insertMany(seedDatabase.initialData.users);
    
    await ProductModel.deleteMany();
    await ProductModel.insertMany(seedDatabase.initialData.products);

    await OrderModel.deleteMany();
    
    await db.disconnect();

    res.status(201).json({
        message: "Proceso realizado con exito"
    })
}