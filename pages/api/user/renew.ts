import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { UserModel } from '../../../models';
import { IUser } from '../../../interfaces';
import { jwt } from '../../../helpers';

type Data =
| {message: string}
| {
    user: {
        name: string,
        email: string,
        role: string
    }, 
    token: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case "GET":
            return renewToken(req, res);
    
        default:
            res.status(404).json({message: "Endpoint no disponible"});
    }
}

const renewToken = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { token = '' } = req.cookies

    let userId = ''
    try {
        userId = await jwt.isValidToken(token)
    } catch (error) {
        res.status(401).json({message: "Token de autolización no es válido"})
    }

    await db.connect();
    const user: IUser = await UserModel.findById(userId).lean();
    await db.connect();

    if(!user){
        res.status(400).json({message: "No existe usuario con este Id"})
    }

    const { name, role, _id, email } = user;

    res.status(200).json({
        token: jwt.signToken(_id, email),
        user: {name, email, role}
    })
}