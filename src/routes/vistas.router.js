import { Router } from "express"
import { ProductsManager } from "../dao/ProductsManager.MongoDB.js"
import { CartsManager } from "../dao/CartsManager.MongoDB.js"
import { isValidObjectId } from "mongoose"
export const router = Router()

router.get("/products", async(req, res) => {
    const cart = await CartsManager.getProductsFromCart("66ec2a6c4df6736b5255b97c")

    let {page, limit, query, sort } = req.query

    limit = Number(limit)
    page = Number(page)

    if (page && isNaN(page)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El argumento page debe ser de tipo numérico` })
    }
    if (limit && isNaN(limit)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El argumento limit debe ser de tipo numérico` })
    }

    const products = await ProductsManager.getProducts(page || 1, limit || 10, sort, query)

    if(!products || !products.payload || !cart || !cart.products){
        res.setHeader("Content-Type", "text/html")
        res.status(404).render("error", {error: "Productos no encontrados."})
    }

    res.setHeader("Content-Type", "text/html")
    res.status(200).render("home", { 
        products: products.payload,
        page: products.page || 1,
        totalPages: products.totalpages || 1,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
        limit: limit,
        numCarts: cart.products.length || 0
     })
})

router.get("/realtimeproducts", async(req, res) => {
    let products = await ProductsManager.getProducts()

    res.setHeader("Content-Type", "text/html")
    res.status(200).render("realTimeProducts", {products: products.payload})

    req.io.on("recargaProductos", (prod) => {
        console.log("recargando")
        res.setHeader("Content-Type", "text/html")
        res.status(200).render("realTimeProducts", {prod})
    })
})

router.get("/carts/:cid", async(req, res) =>{
    let { cid } = req.params

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }

    try {
        let cart = await CartsManager.getCartsById(cid)

        if(!cart){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el carrito solicitado.` })
        }

        res.setHeader("Content-Type", "text/html")
        res.status(200).render("carts", {products: cart.products})
        
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})