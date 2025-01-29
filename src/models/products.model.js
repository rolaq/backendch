import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const userCollection = 'products'

const productSchema = new Schema({
    titulo: String,
    descripcion: String,
    code: String,
    precio: Number,
    estado: Boolean,
    stock: Number,
    categoria: String
})

productSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(userCollection,productSchema);