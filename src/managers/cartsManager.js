import fs from 'fs/promises'
import path from 'path'
import __dirname from '../utils.js'

const ruta = path.join(__dirname, '..', 'managers', 'bdfake', 'carts.json')
console.log('Ruta:', ruta)


const leerCarritos = async ()=>{
    try{
        const cartdata = await fs.readFile(ruta,'utf8')
        const carts = JSON.parse(cartdata)
        return carts

    }catch(error){
        console.log('error al intentar leer el carrito',error)
    }
}

const guardarCarritos = async (carritos) => {
    try {
      await fs.writeFile(ruta, JSON.stringify(carritos, null, 2))

    } catch (error) {
      console.error('Error al guardar los carritos:', error)
    }
  }

const crearCarrito = async () => {

    const carritos = await leerCarritos()
    const nuevoCarrito = {
      id: carritos.length > 0 ? carritos[carritos.length - 1].id + 1 : 1,
      products: [],
    }
    carritos.push(nuevoCarrito)
    await guardarCarritos(carritos)
    return nuevoCarrito
  }
  
const obtenerCarritoPorId = async (cid) => {
    const carritos = await leerCarritos()
    const carrito = carritos.find((carrito) => carrito.id === cid)

    if(!carrito) return null

    return carrito
  }

const agregarProductoACarrito = async (cid, pid) => {
    const carritos = await leerCarritos()
    const carrito = carritos.find((carrito) => carrito.id === cid)
  
    if (!carrito) return null
  
    const productoEnCarrito = carrito.products.find((producto) => producto.product === pid)
  
    if (productoEnCarrito) {
      productoEnCarrito.quantity += 1 
    } else {
      carrito.products.push({ product: pid, quantity: 1 }) 
    }
  
    await guardarCarritos(carritos)
    return carrito
}

export {
  crearCarrito,
  obtenerCarritoPorId,
  agregarProductoACarrito,
}