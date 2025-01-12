const socket = io()

const form = document.getElementById('productForm')
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const product = {
        titulo: document.getElementById('tituloProd').value,
        descripcion: document.getElementById('descripcionProd').value,
        code: document.getElementById('codeProd').value,
        precio: parseFloat(document.getElementById('precioProd').value),
        stock: parseInt(document.getElementById('stockProd').value),
        categoria: document.getElementById('categoriaProd').value,
    }
    console.log(product)
    socket.emit('newProduct', product); // Envía los datos al servidor
    form.reset() // Limpia el formulario
})

const formDelete = document.getElementById('productFormDelete')

formDelete.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("formulario delete escuchado")
    const idProd = document.getElementById('idProd').value

    socket.emit('deleteProd', idProd)
    formDelete.reset() 
})

socket.on('allProducts', products=>{
    const container = document.getElementById('containerProducts')

    container.innerHTML = ''
    products.forEach(product => {
        container.innerHTML += `
            <div>
                <h2> titulo: ${product.titulo}</h2>
                <p> descripcion: ${product.descripcion}</p>
                <p> precio: $ ${product.precio}</p>
                <p> stock: ${product.stock}</p>
                <p> id: ${product.id} </p>
            </div>
        `
    })
})