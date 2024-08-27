import { Router } from "express"
import { ProductsManager } from "../dao/ProductsManager.js"
export const router = Router()

router.get("/", async(req, res) => {
    let productos = await ProductsManager.getProducts()


    res.setHeader("Content-Type", "text/html")
    res.status(200).render("home", { productos })
})
router.get("/realtimeproducts", async(req, res) => {
    let productos = await ProductsManager.getProducts()
    
    res.setHeader("Content-Type", "text/html")
    res.status(200).render("realTimeProducts", {productos})
})