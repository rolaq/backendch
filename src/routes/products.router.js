import express from 'express'
import { leerProductos, agregarProductos, eliminarProductos, modificarProductos } from '../managers/productsManager.js';


const router = express.Router()



router.get('/', async (req, res) => {
    try {
        const productos = await leerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const productos = await leerProductos();
        const nuevoProducto = req.body;

        // Generar un ID único
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

        // Crear el nuevo producto con los campos requeridos
        const productoConId = {
            id: nuevoId,
            titulo: nuevoProducto.titulo,
            descripcion: nuevoProducto.descripcion,
            code: nuevoProducto.code,
            precio: nuevoProducto.precio,
            estado: nuevoProducto.estado !== undefined ? nuevoProducto.status : true,
            stock: nuevoProducto.stock,
            categoria: nuevoProducto.categoria,
        };

        // Validar campos obligatorios
        if (!productoConId.titulo || !productoConId.descripcion || !productoConId.code || !productoConId.precio || !productoConId.stock || !productoConId.categoria) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes' });
        }

        // Agregar el nuevo producto
        await agregarProductos(productoConId);
        res.status(201).json({ message: 'producto agregado correctamente', producto: productoConId });
    } catch (error) {
        res.status(500).json({ error: 'error al agregar producto', details: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoProducto = req.body;
        await agregarProductos(nuevoProducto);
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const idProducto = req.params.id;
        const productoModificado = req.body;
        await modificarProductos(idProducto, productoModificado);
        res.status(200).json({ message: 'Producto modificado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar el producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const idProducto = req.params.id;
        await eliminarProductos(idProducto);
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router
