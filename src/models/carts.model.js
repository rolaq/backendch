import mongoose, { Schema } from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    usuario: { type: String, required: true },
    productos: {
       
        type: [{
            producto: {
                type : Schema.Types.ObjectId,
                ref: 'products'
            },
            cantidad: { type: Number, required: true, default: 1 }
        }],
        default:[]
    }
})

export const carritoModel = mongoose.model(cartsCollection, cartsSchema);