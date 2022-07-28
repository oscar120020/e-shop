import jwt from 'jsonwebtoken';
const jwsKey = process.env.JWT_SECRET || ''

export const signToken = (_id: string, email: string) => {

    if(!jwsKey){
        throw new Error("No hay clave de JWT - Revisar variables de entorno")
    }

    return jwt.sign({_id, email}, jwsKey, {expiresIn: '30d'});
}


export const isValidToken = (token: string): Promise<string> => {

    if(!jwsKey){
        throw new Error("No hay clave de JWT - Revisar variables de entorno")
    }

    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, jwsKey, (error, payload) => {
                if(error) return reject("JWT no es válido");
                const { _id } = payload as {_id: string}

                return resolve(_id)
            })
        } catch (error) {
            return reject("JWT no es válido");
        }
    })

}