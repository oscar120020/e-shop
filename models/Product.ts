import mongoose, { Model, Schema } from 'mongoose';
import { IProduct } from '../interfaces';

const ProductSchema = new Schema({
    description: {
        type: String,
        required: true,
        default: ''
    },
    images: [{type: String}],
    inStock: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    sizes: [{
        type: String,
        enum: {
            values: ['XS','S','M','L','XL','XXL', 'XXXL'],
            message: '{VALUE} no es una talla válida'
        }
    }],
    slug: {
        type: String,
        unique: true,
        required: true
    },
    tags: [{type: String}],
    title: {
        type: String,
        required: true,
        default: ''
    },
    type: {
        type: String,
        enum: {
            values: ['shirts','pants','hoodies','hats'],
            message: '{VALUE} no es una tipo válido'
        },
        default: 'shirts'
    },
    gender: {
        type: String,
        enum: {
            values: ['men','women','kid','unisex'],
            message: '{VALUE} no es una genero válido'
        },
        default: 'unisex'
    },
},
{
    timestamps: true
})

ProductSchema.index({title: 'text', tags: "text"})

const Product: Model<IProduct> = mongoose.models.product || mongoose.model('product', ProductSchema);

export default Product;