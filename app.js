//Definicion de variables a utilizar en el codigo
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCards = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


//Event Listener para esperar que carge el documento, luego llamar la funcion fetchData para traer el JSON
document.addEventListener('DOMContentLoaded', () => {

    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito(carrito)
    }
 })   
 
//Captura de Evento al hacer click en comprar. Llamando la funcion addCarrito para agregar objetos al carrito de compras
cards.addEventListener('click', e => {

    addCarrito(e)


})

items.addEventListener('click', e => {
    btnAccion(e)
})

// el Async para traer todo de la base de datos. IMPORTANTE REPASAR ESTO.
// Ademas de traer los datos, los pintamos en el html con la funcion pintarCard().
const fetchData = async () => {
    try {
        const res = await fetch('datos.json')
        const data = await res.json()
        // console.log(data)
        pintarCard(data)
    }

    catch (error) {
        console.log(error)
    }
}

//Funcion que pinta todas las tarjetas en el HTML, basicamente tomamos el template de las tarjetas y le vamos pasando los valores que nos trajimos del JSON. Luego, lo anexamos en el fragment clonado para luego hacerle un append al div con la clase cards.
const pintarCard = (data) => {

    data.forEach(producto => {
        templateCards.querySelector('h5').textContent = producto.title
        templateCards.querySelector('p').textContent = producto.precio   
        templateCards.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCards.querySelector('button').dataset.id = producto.id
    
    const clone = templateCards.cloneNode(true)
    fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Recibe el evento cuando se da click en los botones y detenemos la propagacion. Llama la funcion setCarrito que guarda en el objeto lo que se ha clicado
const addCarrito = e => {
 
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//Captura el valor del contenido de las tarjetas al hacer click en los botones, guarda en un objeto la información. Adicionalmente, hace la tarea de aumentar en cantidad con cada click. Todavía me parece brujería.
const setCarrito = elemento => {
    const producto = {
        id: elemento.querySelector('.btn-dark').dataset.id,
        title: elemento.querySelector('h5').textContent,
        precio: elemento.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito(carrito)
}

const pintarCarrito = (carrito) => {
    
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter(carrito)

    localStorage.setItem('carrito', JSON.stringify(carrito))

}

const pintarFooter = (carrito) => {

    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML =  `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    }
    else {
        const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
        const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    
        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio
    
        const clone = templateFooter.cloneNode(true)
        fragment.appendChild(clone)
        footer.appendChild(fragment)
    
    }
    

    const btnVaciar = document.getElementById('vaciar-carrito')
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () =>{
            carrito = {}
            pintarCarrito(carrito)

        })
    }
}

const btnAccion = e => {

    //Accion de aumentar
    if(e.target.classList.contains('btn-info')) {
        // carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito(carrito)
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito(carrito)
    }
    e.stopPropagation()
}