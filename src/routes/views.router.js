import express from 'express'
import { productsModel } from '../models/products.model.js'

const router = express.Router()

router.get('/', (req, res)=>{
    res.render('home',{})  
})

router.get('/products', async (req, res)=>{

    try {
        const { page = 1, limit = 20 } = req.query
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };

        const result = await productsModel.paginate({}, options)

        res.render('viewProducts', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null
        })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }

})

router.get('/realtimeproducts', (req, res)=>{
    res.render('realtime',{})  
})

export default router
