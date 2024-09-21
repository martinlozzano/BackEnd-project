const botonSubmit = document.getElementById("btnSubmit")
const listaProductos = document.getElementById("list-products")
const inputs = document.getElementById("formulario")

const inputTitle = document.getElementById("title")
const inputCode = document.getElementById("code")
const inputDescription = document.getElementById("description")
const inputStock = document.getElementById("stock")
const inputPrice = document.getElementById("price")
const inputStatus = document.getElementById("status")
const inputCategory = document.getElementById("category")

const socket = io()
let producto

inputs.addEventListener("change", async(e) => {
    producto = {
        title: inputTitle.value.trim(),
        description: inputDescription.value.trim(),
        price: parseInt(inputPrice.value.trim()),
        code: inputCode.value.trim(),
        stock: parseInt(inputStock.value.trim()),
        category: inputCategory.value.trim(),
        status: (inputStatus.value.toLowerCase().trim() === "true") || (inputStatus.value.trim() === "")
    }
})

botonSubmit.addEventListener("click", async(e) => {
    e.preventDefault()

    let title = inputTitle.value.trim()
    let description = inputDescription.value.trim()
    let price = inputPrice.value.trim()
    let code = inputCode.value.trim()
    let category = inputCategory.value.trim()
    let stock = inputStock.value.trim()

    if(!title){
        alert("¡¡Complete el nombre!!")
        return
    }
    if(!description){
        alert("¡¡Complete la descripción!!")
        return
    }
    if(!price){
        alert("¡¡Complete el precio!!")
        return
    }
    if(!code){
        alert("¡¡Complete el código!!")
        return
    }
    if(!stock){
        alert("¡¡Complete el stock!!")
        return
    }
    if(!category){
        alert("¡¡Complete la categoria!!")
        return
    }

    let response = await fetch("/api/products", {
        method:"post",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(producto)
    })

    let datos = await response.json()

    if(response.status===201){
        socket.emit("inputs", producto)
    }else{
        alert(datos.error)
    }
})

const eliminarProducto = async(productoID) => {

    let response = await fetch(`/api/products/${productoID}`, {
        method:"delete",
        headers:{
            "Content-Type": "application/json"
        }
    })

    let datos = await response.json()
    console.log(datos, response.status)

    if(response.status===200){
        let liProductoEliminar = document.getElementById(`producto-${productoID}`)
        listaProductos.removeChild(liProductoEliminar)
    }else{
        alert(datos.error)
    }
}

socket.on("productoNuevo", productoNuevo => {
    let { title, description, price, _id } = productoNuevo

    let list = document.createElement("li")
    list.setAttribute("id", `producto-${_id}`)
    list.innerHTML = `
        <h3><strong>Nombre: </strong>${title}</h3>
        <p><strong>Descripcion: </strong>${description}</p>
        <span><strong>Precio: </strong>${price}</span>
        <button onclick="eliminarProducto('${_id}')">Eliminar</button>
        
    `
    listaProductos.append(list)
})