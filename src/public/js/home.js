const botonAgregarCarrito = document.getElementById("btn-agregar-carrito")
const botonPrevLink = document.getElementById("prev-link")
const botonNextLink = document.getElementById("next-link")

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

const activadorLinks = () => {
    let paginaPrevia = document.getElementById("prev-link").getAttribute("data-paginaprevia")
    let paginaSiguiente = document.getElementById("next-link").getAttribute("data-paginasiguiente")
    if (!paginaPrevia){
        botonPrevLink.style.display = "none"
    }else{
        botonPrevLink.style.display = ""
    }
    if (!paginaSiguiente){
        botonNextLink.style.display = "none"
    }else{
        botonNextLink.style.display = ""
    }

}

activadorLinks()
