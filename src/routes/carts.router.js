import express from 'express'

import { carritoModel } from '../models/carts.model.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { usuario } = req.body
  const carrito = await carritoModel.create({
    usuario
  })

  res.send({carrito})
});

router.get('/', async (req, res) => {
  try {
      const carritos = await carritoModel.find()
      res.send({ carritos })
  } catch (error) {
      console.error('Error al obtener los carritos:', error)
      res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

router.get('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const carrito = await carritoModel.findById(cid).populate('productos.producto');
      res.send({ carrito })
  } catch (error) {
      console.error('Error al obtener los carritos:', error)
      res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const { idProduct } = req.body

    const carrito = await carritoModel.findById(cid);
    
    const productoEnCarrito = carrito.productos.find(p => p.producto.toString() === idProduct)

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1
    } else {
      carrito.productos.push({ producto: idProduct, cantidad: 1 })
    }

    await carrito.save()

    res.json({ mensaje: 'Producto agregado al carrito', carrito })
    } catch (error) {
    console.error('Error al agregar el producto al carrito:', error)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
})


// ruta para modificar la cantidad del producto select de carrito select 
router.put('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params
      const { cantidad } = req.body

      const carrito = await carritoModel.findById(cid)
   
      
      const productoEnCarrito = carrito.productos.find(p => p.producto.toString() === pid)
    
  
      productoEnCarrito.cantidad = cantidad

      await carrito.save()

      res.json({ status: "success", message: "Cantidad de producto actualizada", carrito })
  } catch (error) {
      console.error("Error al actualizar la cantidad del producto en el carrito:", error)
      res.status(500).json({ status: "error", message: "Error interno del servidor" })
  }
})



router.delete('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params

      const carrito = await carritoModel.findById(cid)
 
      carrito.productos = carrito.productos.filter(p => p.producto.toString() !== pid)

      await carrito.save();

      res.json({ status: "success", message: "Producto eliminado del carrito", carrito })
  } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error)
      res.status(500).json({ status: "error", message: "Error interno del servidor" })
  }
})

router.delete('/:cid', async (req, res) => {
  try {

    const { cid } = req.params

    const carrito = await carritoModel.findById(cid)
 
    carrito.productos = []
    await carrito.save()

    res.json({ mensaje: 'Carrito vaciado exitosamente', carrito })

  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})


export default router