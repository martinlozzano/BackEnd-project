import fs from "fs"
export class CartsManager{
    static path

    static async getCarts(){
        if (fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, {encoding:"utf-8"}))
        } else {
            return []
        }
    }

    static async addCart(products){
        let carts = await this.getCarts()

        let id = 1
        if (carts.length > 0){
            id = Math.max(...carts.map(d=>d.id)) + 1
        }

        let newCart = { id,  products}

        carts.push(newCart)

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))

        return newCart
    }

    static async addProductToCart(cid, producto){
        let carritos = await this.getCarts()

        let indiceCarritoSeleccionado = carritos.findIndex(cart => cart.id === cid)

        if(indiceCarritoSeleccionado === -1){
            throw new Error(`ERROR: No se encontró un carrito con el id ${cid}`)
        }

        let productoAgregado = { id: producto.id, quantity: 1 }

        let productoExiste = carritos[indiceCarritoSeleccionado].products.find(prod => prod.id === producto.id)

        if(!productoExiste){
            carritos[indiceCarritoSeleccionado].products.push(productoAgregado)
        } else{
            carritos[indiceCarritoSeleccionado].products.find(prod => prod.id === producto.id).quantity++
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, 5))

        return carritos[indiceCarritoSeleccionado]
    }
}