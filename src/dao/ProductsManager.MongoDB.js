import { response } from "express"
import { productsModel } from "./models/productsModel.js"

export class ProductsManager {
    static async getProducts(page = 1, limit = 10, sort, query) {

        let ordenamiento = {}

        if(sort && (sort.toLowerCase() === "asc" || sort.toLowerCase() === "desc")){
            if(sort === "asc"){
                ordenamiento = {price: 1}
            } else{
                ordenamiento = {price: -1}
            }
        }

        const filtro = query ? {$expr: {$eq: [{ $toLower: "$category" }, query.toLowerCase()]}} : {}

        const productosPorParams = await productsModel.paginate(filtro, {
            sort: ordenamiento,
            lean:true,
            page,
            limit
        })

        return {
            status: productosPorParams ? "success" : "error",
            payload: productosPorParams.docs,
            totalpages: productosPorParams.totalPages,
            prevPage:productosPorParams.prevPage,
            nextPage:productosPorParams.nextPage,
            page:productosPorParams.page,
            hasPrevPage:productosPorParams.hasPrevPage,
            hasNextPage:productosPorParams.hasNextPage,
            prevLink:productosPorParams.hasPrevPage ? `/api/products?limit=${limit}&page=${productosPorParams.prevPage}` : null,
            nextLink:productosPorParams.hasNextPage ? `/api/products?limit=${limit}&page=${productosPorParams.nextPage}` : null
        }
    }

    static async getProductsbyId(id) {
        return await productsModel.findById(id).lean()
    }

    static async addProduct(product = {}) {
        return await productsModel.create(product)
    }

    static async updateProduct(pid, camposActualizar) {
        return await productsModel.findByIdAndUpdate(pid, camposActualizar, {new:true}).lean()
    }

    static async deleteProduct(pid){
        return await productsModel.findByIdAndDelete(pid).lean()
    }
}