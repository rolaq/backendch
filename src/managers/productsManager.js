
import fs from 'fs/promises'
const ruta = 'productos.json'

const leerProductos = async ()=>{
    try{

        const data = await fs.readFile(ruta,'utf8')
        const productos = JSON.parse(data)
        
        return productos

    }catch(error){
        console.log('error al intentar leer los productos',error);
    }
}

const agregarProductos = async (productoNuevo)=>{
    try{

        const productos = await leerProductos()
        productos.push(productoNuevo)
        
    }catch(error){
        console.log('error al intentar agregar los productos',error);
    }
}

const eliminarProductos = async (idProducto)=>{
    try{
        const productos = await leerProductos();
        const productosActualizados = productos.filter(p => p.id !== idProducto);
        await fs.writeFile(ruta, JSON.stringify(productosActualizados, null, 2));
    }catch(error){
        console.log('error al intentar eliminar los productos',error);
    }
}

const modificarProductos = async (idProducto)=>{
    try{
        const productos = await leerProductos();
        const productosActualizados = productos.map(p => 
            p.id === idProducto ? { ...p, ...productoModificado } : p
        );
        await fs.writeFile(ruta, JSON.stringify(productosActualizados, null, 2)); 
    }catch(error){
        console.log('error al intentar modificar los productos',error);
    }
}

const newProducto = {
    id : "asd" ,
    nombre : "gola"
}

agregarProductos(newProducto)

export {
    leerProductos,
    agregarProductos,
    eliminarProductos,
    modificarProductos
};