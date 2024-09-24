import { cartsModel } from "./models/cartsModel.js"

export class CartsManager{
    static async getCarts(){
        return await cartsModel.find().lean()
    }

    static async getCartsById(id) {
        return await cartsModel.findById(id).lean()
    }

    static async getProductsFromCart(cid) {
        let cart = await cartsModel.findById(cid).populate("products.product").lean()

        if (!cart){
            throw new Error("No se encontró el carrito.")
        }

        return cart
    }

    static async createCart(products){
        return await cartsModel.create(products)
    }

    static async addProductToCart(cid, pid){    
        const productoEnCarrito = await cartsModel.findOne({
            _id: cid,
            "products.product": pid
        })

        if(productoEnCarrito){
            await cartsModel.updateOne(
                {_id: cid, "products.product": pid},
                {$inc: {"products.$.quantity": 1}})
        } else {
            await cartsModel.updateOne(
                {_id: cid},
                {$push: {products: {product: pid, quantity: 1}}})
        }
    }

    static async deleteProductFromCart(cid, pid){
        const productoEnCarrito = await cartsModel.findOne({
            _id: cid,
            "products.product": pid
        })

        if(!productoEnCarrito){
            throw new Error("El producto no existe en el carrito seleccionado")
        }

        await cartsModel.updateOne(
            {_id: cid},
            {$pull: {products: {product: pid}}})
    }

    static async vaciarCarrito(cid){
        await cartsModel.updateOne(
            {_id: cid},
            {$set: {products: []}})
    }

    static async actualizarCarrito(cid, products, productosDB){
        let carritoExiste = await this.getCartsById(cid)

        if(!carritoExiste){
            throw new Error("El carrito seleccionado no existe.")
        }

        products.forEach((prod) => {
            let productoExiste = productosDB.payload.some(product => String(product._id) === prod.product)
            
            if(!productoExiste){
                throw new Error(`El producto de id ${prod.product} no existe en la DB.`)
            }
        })

        const conteo = {}

        products.forEach(item => {
            if (conteo[item.product]) {
                throw new Error(`No se pueden poner productos duplicados.`)
            } else {
                conteo[item.product] = true;
            }
        })

        return await cartsModel.updateOne({_id: cid},
            {$set: { products }}
        )
    }

    static async actualizarCantidad(cid, pid, quantity){
        await cartsModel.updateOne({_id: cid, "products.product": pid},
            {$set: { "products.$.quantity": quantity}}
        )
    }
}