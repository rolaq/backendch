import fs from 'fs/promises'
import path from 'path'
import { __dirname } from '../utils/dirname.js'

const ruta = path.join(__dirname, '..', 'managers', 'bdfake', 'productos.json')
console.log('Ruta:', ruta);

const leerProductos = async ()=>{
    try{

        const data = await fs.readFile(ruta,'utf8')
        const productos = JSON.parse(data)
        
        return productos

    }catch(error){
        console.log('error al intentar leer los productos',error)
    }
}

const buscarProducto = async (idProducto)=>{
    try {
        const productos = await leerProductos()
        const productoBuscado = productos.find((producto) => producto.id === idProducto)
    
        if (productoBuscado) {
          return productoBuscado
        }

      } catch (error) {
        console.error('Error al buscar el producto:', error)
      }
}

const agregarProductos = async (productoNuevo)=>{
    try{

        const productos = await leerProductos()
        productos.push(productoNuevo)
        await fs.writeFile(ruta, JSON.stringify(productos))
    }catch(error){
        console.log('error al intentar agregar los productos',error)
    }
}

const eliminarProductos = async (idProducto)=>{
    try{
        const productos = await leerProductos()
        const productosActualizados = productos.filter(p => p.id !== idProducto)
        await fs.writeFile(ruta, JSON.stringify(productosActualizados, null, 2))
    }catch(error){
        console.log('error al intentar eliminar los productos',error)
    }
}

const modificarProductos = async (idProducto)=>{
    try{
        const productos = await leerProductos()
        const productosActualizados = productos.map(p => 
            p.id === idProducto ? { ...p, ...productoModificado } : p
        )
        await fs.writeFile(ruta, JSON.stringify(productosActualizados, null, 2))
    }catch(error){
        console.log('error al intentar modificar los productos',error)
    }
}

export {
    leerProductos,
    buscarProducto,
    agregarProductos,
    eliminarProductos,
    modificarProductos
};
