import {Router} from "express"
import { CartsManager } from "../dao/CartsManager.MongoDB.js"
import { ProductsManager } from "../dao/ProductsManager.MongoDB.js"
import { isValidObjectId } from "mongoose"

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

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de id inválido."})
    }

    try {
        let carrito = await CartsManager.getCartsById(cid)

        if (!carrito) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el carrito con el id solicitado`})
        }

        res.setHeader("Content-Type", "application/json")
        return res.status(200).json(carrito)

    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

    /* let carritoPorId = carritos.find(cart => cart.id === cid)
    if (!carritoPorId) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `No existe el carrito con el id solicitado`})
    } */

    /* res.setHeader("Content-Type", "application/json")
    return res.status(200).json(carritoPorId) */
})

router.post("/", async (req, res) =>{
    try {
        let carritoNuevo = await CartsManager.createCart()
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

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }

    if(!isValidObjectId(pid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de pid inválido."})
    }
    
    let productoEncontrado
    try {
        productoEncontrado = await ProductsManager.getProductsbyId(pid)

        if (!productoEncontrado) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el producto con el id solicitado` })
        }
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

    try {
        await CartsManager.addProductToCart(cid, pid)
        let prodAgregado = await CartsManager.getCartsById(cid)
        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({prodAgregado})
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})

router.delete("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }

    if(!isValidObjectId(pid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de pid inválido."})
    }
    
    try {
        let carritoExiste = await CartsManager.getCartsById(cid)

        if(!carritoExiste){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el carrito con el id solicitado` })
        }

        await CartsManager.deleteProductFromCart(cid, pid)

        let carritoModificado = await CartsManager.getCartsById(cid)

        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({carritoModificado})
        
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})

router.delete("/:cid", async(req,res) =>{
    let { cid } = req.params

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }

    try {
        let carritoExiste = await CartsManager.getCartsById(cid)

        if(!carritoExiste){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `No existe el carrito con el id solicitado` })
        }

        await CartsManager.vaciarCarrito(cid)

        let carritoModificado = await CartsManager.getCartsById(cid)

        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({carritoModificado})
        
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})

router.put("/:cid", async(req, res)=>{
    let { cid } = req.params
    let productos = req.body

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }    

    try {
        let productosDB = await ProductsManager.getProducts()
        await CartsManager.actualizarCarrito(cid, productos, productosDB)
        let carritoModificado = await CartsManager.getCartsById(cid)

        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({carritoModificado})
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

})

router.put("/:cid/product/:pid", async(req, res)=>{
    let { cid, pid } = req.params
    let {quantity} = req.body

    quantity = Number(quantity)

    if(isNaN(quantity)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de quantity inválido."})
    }

    if(!isValidObjectId(cid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de cid inválido."})
    }

    if(!isValidObjectId(pid)){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"Formato de pid inválido."})
    }

    if(quantity < 1){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error:"La cantidad no puede ser menor a 1."})
    }

    try {
        
        await CartsManager.actualizarCantidad(cid, pid, quantity)
        let carritoModificado = await CartsManager.getCartsById(cid)

        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({carritoModificado})
        
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})