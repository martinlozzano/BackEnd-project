import {Router} from "express"
export const router = Router()
import { ProductsManager } from "../dao/ProductsManager.js"

ProductsManager.path = "./src/data/products.json"

router.get("/", async (req, res) => {
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

    let { limit, skip } = req.query
    if (limit) {
        limit = Number(limit)
        if (isNaN(limit)) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El argumento limit debe ser de tipo numérico` })
        }
    } else {
        limit = productos.length
    }

    if (skip) {
        skip = Number(skip)
        if (isNaN(skip)) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El argumento skip debe ser de tipo numérico` })
        } else if (skip >= productos.length) {
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El argumento skip no debe superar la cantidad de productos existentes` })
        }
    } else {
        skip = 0
    }

    let products = productos.slice(skip, skip + limit)

    res.setHeader("Content-Type", "application/json")
    return res.status(200).json(products)
})

router.get("/:pid", async (req, res) => {
    let { pid } = req.params

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

    let product = productos.find(producto => producto.id === pid)

    if (!product) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `No existe el producto con el id solicitado` })
    }

    res.setHeader("Content-Type", "application/json")
    return res.status(200).json(product)
})

router.post("/", async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails = [""] } = req.body

    price = parseInt(price)
    status = Boolean(status)
    stock = parseInt(stock)

    //VALIDACIONES

    if(!title || typeof title !== "string"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo title sea colocado y que sea un string.`})
    }
    if(!description || typeof description !== "string"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo description sea colocado y que sea un string.`})
    }
    if(!code || typeof code !== "string"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo code sea colocado y que sea un string.`})
    }
    if(!price || typeof price !== "number"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo price sea colocado y que sea un number.`})
    }
    if(status && typeof status !== "boolean"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo status sea colocado y que sea un boolean.`})
    }else if(status === undefined){
        status=true
    }
    if(!stock || typeof stock !== "number"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo stock sea colocado y que sea un number.`})
    }
    if(!category || typeof category !== "string"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo category sea colocado y que sea un string.`})
    }
    if(typeof thumbnails !== "object"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `Es necesario que el campo thumbnails sea un array de strings.`})
    }

    let productos
    try {
        productos = await ProductsManager.getProducts()
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

    let existeCode = productos.find(producto => producto.code === code)
    if(existeCode){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({error: `El code ingresado ya se encuentra asignado a un producto.`})
    }

    let product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }

    try {
        let productoNuevo = await ProductsManager.addProduct(product)
        res.setHeader("Content-Type", "application/json")
        return res.status(201).json({productoNuevo})
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})

router.put("/:pid", async(req, res) => {
    let camposActualizar = req.body
    delete camposActualizar.id

    let { pid } = req.params

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

    //VALIDACIONES

    pid = Number(pid)
    if (isNaN(pid)) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El parámentro debe ser de tipo numérico.` })
    }

    if(camposActualizar.code){
        if(typeof camposActualizar.code !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El code debe ser de tipo string.` })
        } 

        let existeCode = productos.find(prod => prod.code === camposActualizar.code && prod.id !== pid)

        if(existeCode){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `Ya hay un producto con el code propuesto.` })
        }
    }
    if(camposActualizar.title){
        if (typeof camposActualizar.title !== "string"){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `El title debe ser de tipo string.` })
        }
        let existetitle = productos.find(prod => prod.title === camposActualizar.title && prod.id !== pid)
        if(existetitle){
            res.setHeader("Content-Type", "application/json")
            return res.status(400).json({ error: `Ya hay un producto con el code propuesto.` })
        }
    }
    if (camposActualizar.price && typeof camposActualizar.price !== "number"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El price debe ser de tipo number.` })
    }
    if (camposActualizar.status && typeof camposActualizar.status !== "boolean"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El status debe ser de tipo boolean.` })
    }
    if (camposActualizar.description && typeof camposActualizar.description !== "string"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El description debe ser de tipo string.` })
    }
    if (camposActualizar.category && typeof camposActualizar.category !== "string"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El category debe ser de tipo string.` })
    }
    if (camposActualizar.stock && typeof camposActualizar.stock !== "number"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El stock debe ser de tipo number.` })
    }
    if (camposActualizar.thumbnails && typeof camposActualizar.thumbnails !== "object"){
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El thumbnails debe ser de tipo array de strings.` })
    }

    try {
        let productoModificado = await ProductsManager.updateProduct(pid, camposActualizar)
        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({productoModificado})
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }

})

router.delete("/:pid", async(req, res) => {
    let { pid } = req.params

    pid = Number(pid)
    if (isNaN(pid)) {
        res.setHeader("Content-Type", "application/json")
        return res.status(400).json({ error: `El parámentro debe ser de tipo numérico.` })
    }

    try {
        let productoEliminado = await ProductsManager.deleteProduct(pid)
        res.setHeader("Content-Type", "application/json")
        return res.status(200).json({productoEliminado})
    } catch (error) {
        console.log(error)
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({
            error: `Error inesperado en el servidor.`,
            detalle: `${error.message}`
        })
    }
})