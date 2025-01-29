import express from 'express'
import { productsModel } from '../models/products.model.js'


const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true 
        };

        const result = await productsModel.paginate({}, options);

        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
        };

        res.json(response)
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
});



router.get('/:id', async (req, res)=>{
    try{

        const idProducto = req.params.id
    
        const result = await productsModel.findById(idProducto)
        res.send({result})

    } catch(error){
        res.status(500).json({error: 'Error interno del servidor'})
    }
})

router.post('/', async (req, res) => {
    try {
        const { titulo , descripcion , code , precio , estado , stock , categoria } = req.body
        
        const result = await productsModel.create({
            titulo,
            descripcion,
            code,
            precio,
            estado,
            stock,
            categoria
        })
        
        res.send(result)
    } catch (error) {
        res.status(500).json({ error: 'error al agregar producto', details: error.message })
    }
});


router.put('/:id', async (req, res) => {
    try {
        const idProducto = req.params.id
        const productoModificado = req.body;
        await modificarProductos(idProducto, productoModificado);
        res.status(200).json({ mensaje: 'Producto modificado exitosamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar el producto' })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const idProducto = parseInt(req.params.id)
        await eliminarProductos(idProducto)
        res.status(200).json({ mensaje: 'Producto eliminado exitosamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' })
    }
})

export default router
