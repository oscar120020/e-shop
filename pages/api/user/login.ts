import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { UserModel } from '../../../models';
import bcrypt from 'bcryptjs';
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
        case "POST":
            return login(req, res);
    
        default:
            res.status(404).json({message: "Endpoint no disponible"});
    }
}

const login = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '' } = req.body

    await db.connect();
    const user = await UserModel.findOne({email}).lean();
    await db.disconnect();

    if(!user){
        return res.status(400).json({message: "Correo o contraseña no válidos - EMAIL"})
    }

    if(!bcrypt.compareSync(password, user.password!)){
        return res.status(400).json({message: "Correo o contraseña no válidos - PASSWORD"})
    }

    const { name, role, _id } = user;

    const token = jwt.signToken(_id, email);
    
    res.status(200).json({
        user: {email, name, role},
        token
    })
}