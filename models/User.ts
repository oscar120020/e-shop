import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '../interfaces';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'client'],
            message: '{VALUE} no es un rol válido',
            default: 'client',
            required: true
        }
    }
},
{
    timestamps: true
})

const User: Model<IUser> = mongoose.models.user || mongoose.model('user', UserSchema);

export default User;