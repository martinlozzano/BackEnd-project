import mongoose, { Schema } from "mongoose"

const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [{
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required:true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }],
            default: []
        },
    },
    {
        timestamps: true
    },
    
)

cartsSchema.pre("findOne", function(){
    this.populate("products.product").lean()
})
cartsSchema.pre("find", function(){
    this.populate("products.product").lean()
})

export const cartsModel = mongoose.model("carts", cartsSchema)