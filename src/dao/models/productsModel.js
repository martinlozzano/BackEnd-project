import mongoose, { Schema } from "mongoose"
import paginate from "mongoose-paginate-v2"

const productsSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: {
            type: String, unique: true
        },
        price: Number,
        status: {
            type: Boolean, default: true
        },
        stock: Number,
        category: String,
        thumbnails: []
    },
    {
        timestamps: true
    }
)

productsSchema.plugin(paginate)

export const productsModel = mongoose.model("products", productsSchema)