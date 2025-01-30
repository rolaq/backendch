import express from 'express'
import productRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import connectionMongo from './connection/mongo.js'
import { productsModel } from './models/products.model.js'

const PORT = 8080
const app = express()

connectionMongo()

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

    console.log('Usuario conectado:', socket.id)

    try {
        const productos = await productsModel.find()
        socket.emit('allProducts', productos)

        socket.on('newProduct', async (product) => {
            try {
                const newProduct = {
                    ...product, 
                    estado: product.estado !== undefined ? product.estado : true 
                };

                await productsModel.create(newProduct)
                const productosActualizados = await productsModel.find()
                ioServer.emit('allProducts', productosActualizados)
            } catch (error) {
                console.error("Error al agregar producto:", error)
            }
        })

        socket.on('deleteProd', async (idProd) => {
            try {
                console.log("producto eliminado id: ", idProd)

                await productsModel.findByIdAndDelete(idProd)

                const productosActualizados = await productsModel.find()
                ioServer.emit('allProducts', productosActualizados)
            } catch (error) {
                console.error("Error al eliminar producto:", error)
            }
        });

    } catch (error) {
        console.error('Error al gestionar productos:', error)
    }
});