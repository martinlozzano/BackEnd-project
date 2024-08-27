import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import { router as productsRouter} from "./routes/products.router.js"
import { router as cartsRouter} from "./routes/carts.router.js"
import { router as vistasRouter } from "./routes/vistas.router.js"

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products/", productsRouter)
app.use("/api/carts/", cartsRouter)
app.use("/", vistasRouter)

const serverHTTP = app.listen(PORT, () => console.log(`Servidor online en puerto ${PORT}`))

let io = new Server(serverHTTP)

io.on("connection", socket=>{
    console.log(`Se ha contectado un cliente con id ${socket.id}`)

    socket.on("inputs", producto => {
        io.emit("nuevoProducto", producto)
    })
    socket.on("eliminarProd", () => {
        io.emit("prodEliminado")
    })
})