import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { ProductModel } from '../../../models';

type Data = 
| { message: string }
| IProduct[]

export default function hendler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case "GET":
          return searchProducts(req, res);
    
        default:
          return res.status(400).json({ message: "Endpoint no disponible" });
      }
}

const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    let {q = ''} = req.query;

    if(!q){
        return res.status(400).json({message: "Debe enviar una query de busqueda"});
    }

    q = q.toString().toLocaleLowerCase();

    await db.connect();
    const products = await ProductModel.find({ 
        $text: { $search: q } 
    })
    .select('images price title inStock slug -_id')
    .lean();
    await db.disconnect();

    return res.status(200).json(products);
}
