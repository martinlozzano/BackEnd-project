import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import { router as productsRouter} from "./routes/products.router.js"
import { router as cartsRouter} from "./routes/carts.router.js"
import { router as vistasRouter } from "./routes/vistas.router.js"
import { connDB } from "./data/connDB.js"

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

app.engine("handlebars", engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/api/products/", 
    (req, res, next) => {
        req.io=io
        next()
    },
    productsRouter)
app.use("/api/carts/",
    (req, res, next) => {
        req.io=io
        next()
    },
    cartsRouter)
app.use("/",
    (req, res, next) => {
        req.io=io
        next()
    },
    vistasRouter)

const serverHTTP = app.listen(PORT, () => console.log(`Servidor online en puerto ${PORT}`))

let io = new Server(serverHTTP)

io.on("connection", socket=>{
    console.log(`Se ha contectado un cliente con id ${socket.id}`)
})

connDB()