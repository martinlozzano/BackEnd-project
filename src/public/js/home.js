const botonAgregarCarrito = document.getElementById("btn-agregar-carrito")


const socket = io()

const agregarAlCarrito = async(productoId) => {
//Está hardcodeado para enviar los productos a un carrito
    console.log(productoId)

    let response = await fetch(`api/carts/66ec2a6c4df6736b5255b97c/product/${productoId}`, { 
        method:"post",
        headers:{
            "Content-Type": "application/json"
        }
    })

   location.reload()
}