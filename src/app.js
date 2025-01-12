import express from 'express'
import productRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import { leerProductos , agregarProductos, eliminarProductos } from './managers/productsManager.js';

const PORT = 8080
const app = express()

//configuracion motor de plantillas 

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({extended:true})) // peticiones complejas con req.query
app.use(express.static(__dirname + '/public'))

//routes 

app.use('/api/products', productRouter)

app.use('/api/carts', cartsRouter)

app.use('/',viewsRouter)

const httpServer = app.listen(PORT, ()=>{
    console.log("server on port: ",PORT);
})

const ioServer = new Server(httpServer)

ioServer.on('connection', async (socket) => {
    console.log('Usuario conectado:', socket.id);

    try {
      
        const productos = await leerProductos()
        socket.emit('allProducts', productos)

        socket.on('newProduct', async (product) => {

            const listaproductos = await leerProductos()
            const nuevoId = listaproductos.length > 0 ? Math.max(...listaproductos.map(p => p.id)) + 1 : 1
            
            const newProduct = {
                id: nuevoId,
                ...product, 
                estado: product.estado !== undefined ? product.estado : true 
            }

            await agregarProductos(newProduct)

            const productosActualizados = await leerProductos()
            ioServer.emit('allProducts', productosActualizados)
        })

        socket.on('deleteProd', async idProd=>{
            console.log("id recibido: ", idProd);
            await eliminarProductos(parseInt(idProd))

            const productosActualizados = await leerProductos()
            ioServer.emit('allProducts', productosActualizados)
        })
    } catch (error) {
        console.error('Error al gestionar productos:', error);
    }

});