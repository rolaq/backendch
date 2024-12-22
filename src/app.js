import express from 'express'
import productRouter from './routes/products.router.js'
import viewsRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'


const PORT = 8080
const app = express()

//configuracion motor de plantillas 

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'handlebars')
app.set('views', './src/views')


app.use(express.json())
app.use(express.urlencoded({extended:true})) // peticiones complejas con req.query
app.use(express.static('public'))

//routes 

app.use('/api/products', productRouter)

app.use('/cart', productRouter)

app.use('/',viewsRouter)

app.listen(PORT, ()=>{
    console.log("server on port: ",PORT);
})