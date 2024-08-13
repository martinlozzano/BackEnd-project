import {Router} from "express"
import { CartsManager } from "../dao/CartsManager.js"
import { ProductsManager } from "../dao/ProductsManager.js"

export const router = Router()

CartsManager.path = "./src/data/carts.json"

router.get("/", async (req, res) =>{
    let carritos
    try {
        carritos = await CartsManager.getCarts()
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
    res.setHeader("Content-Type", "application/json")
    return res.status(200).json(carritos)
})

router.get("/:cid", async (req, res) =>{
    let { cid } = req.params

    cid = Number(cid)
    if (isNaN(cid)) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El parámentro debe ser de tipo numérico.` })
    }

    let carritos
    try {
        carritos = await CartsManager.getCarts()
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

    let carritoPorId = carritos.find(cart => cart.id === cid)
    if (!carritoPorId) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `No existe el carrito con el id solicitado`})
    }

    res.setHeader("Content-Type", "application/json")
    return res.status(200).json(carritoPorId)
})

router.post("/", async (req, res) =>{
    let cart = req.body
    let productos = cart.length>0 ? cart : []

    try {
        let carritoNuevo = await CartsManager.addCart(productos)
        res.setHeader("Content-Type", "application/json")
        return res.status(201).json({carritoNuevo})
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})

router.post("/:cid/product/:pid", async (req, res) =>{
    let { cid, pid } = req.params

    cid = Number(cid)
    if (isNaN(cid)) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El parámentro debe ser de tipo numérico.` })
    }

    pid = Number(pid)
    if (isNaN(pid)) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El parámentro debe ser de tipo numérico.` })
    }
    
    let productos
    try {
        productos = await ProductsManager.getProducts()
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

    let productoEncontrado = productos.find(producto => producto.id === pid)

    if (!productoEncontrado) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `No existe el producto con el id solicitado` })
    }

    try {
        let productoAgregado = await CartsManager.addProductToCart(cid, productoEncontrado)
        res.setHeader("Content-Type", "application/json")
        return res.status(200).json(productoAgregado)
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }


})