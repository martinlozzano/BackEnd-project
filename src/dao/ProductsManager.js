import fs from "fs"
export class ProductsManager {
    static path

    static async getProducts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
        } else {
            return []
        }
    }

    static async addProduct(product = {}) {
        let productos = await this.getProducts()

        let id = 1
        if (productos.length > 0) {
            id = Math.max(...productos.map(d=>d.id)) + 1 
        }

        let nuevoProducto = {
            id,
            ...product
        }

        productos.push(nuevoProducto)

        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 5))

        return productos
    }

    static async updateProduct(id, camposActualizar={}){
        let productos = await this.getProducts()

        let indexProduct = productos.findIndex(prod => prod.id === id)
        
        if(indexProduct === -1){
            throw new Error(`ERROR: No se encontró un producto con el id ${id}`)
        }

        productos[indexProduct]={
            ...productos[indexProduct],
            ...camposActualizar,
            id
        }

        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 5))

        return productos[indexProduct]
    }

    static async deleteProduct(id){
        let productos = await this.getProducts()

        let indexProduct = productos.findIndex(prod => prod.id === id)

        if(indexProduct === -1){
            throw new Error(`ERROR: No se encontró un producto con el id ${id}`)
        }

        let productoEliminado = productos.splice(indexProduct, 1)

        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 5))

        return productoEliminado
    }
}