import express from 'express'
import { crearCarrito, obtenerCarritoPorId, agregarProductoACarrito } from '../managers/cartsManager.js';

const router = express.Router()

//Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = await crearCarrito()
    res.status(200).json(nuevoCarrito)
  } catch (error) {
    console.error('Error al crear un carrito:', error)
    res.status(500).json({ mensaje: 'Error del servidor' })
  }
});

//Obtener productos de un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10)
    const carrito = await obtenerCarritoPorId(cid)

    if (carrito) {
      res.status(200).json(carrito.products)
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' })
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
});

// Agregar un producto a un carrito con id de carrito e id del producto
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10)
    const pid = parseInt(req.params.pid, 10)

    const carritoActualizado = await agregarProductoACarrito(cid, pid)

    if (carritoActualizado) {
      res.status(200).json(carritoActualizado);
    } else {
      res.status(404).json({ mensaje: 'Carrito no encontrado' })
    }
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

export default router