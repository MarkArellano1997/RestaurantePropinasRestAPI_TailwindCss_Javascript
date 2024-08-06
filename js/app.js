let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categoria = {
    1: "Comida",
    2: "Postres",
    3: "Bebidas"
}

const btnOpenModal = document.querySelector('#open-modal')
const btnCloseModal = document.querySelector('#close-modal')
const btnCrearOrden = document.querySelector('#crud-modal form button')

btnOpenModal.addEventListener('click', abrirModal)
btnCloseModal.addEventListener('click', cerrarModal)
btnCrearOrden.addEventListener('click', validarFormulario)

function abrirModal() {
    const modal = document.querySelector('#crud-modal')
    modal.classList.remove('hidden')
}

function cerrarModal() {
    const modal = document.querySelector('#crud-modal')
    modal.classList.add('hidden')
}

function validarFormulario(e) {

    e.preventDefault()

    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value

    const camposVacios = [mesa, hora].some(campo => campo === '')

    if (camposVacios) {

        mostrarAlerta('Todos los campos son obligatorios')

        return
    }

    cerrarModal()

    obtenerPlatillos()

    cliente = {
        ...cliente,
        mesa,
        hora
    }
    
}

function mostrarAlerta(mensaje) {

    const alertaPrevia = document.querySelector('.alerta')
    if (!alertaPrevia) {
        const modalBody = document.querySelector('#modal-body')
        const alerta = document.createElement('P')
        alerta.classList.add('text-white', 'text-center', 'mt-2', 'alerta')
        alerta.textContent = mensaje

        modalBody.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);

        return
    }

}

function obtenerPlatillos() {
    const url = `http://localhost:4000/platillos`
    fetch(url)
        .then(respuesta=>respuesta.json())
        .then(resultado=>mostrarPlatillos(resultado))
        .catch(error=>console.log(error))
}

function mostrarPlatillos(platillos) {

    const divPlatillos = document.querySelector('#platillos')
    divPlatillos.classList.remove('hidden')

    const divResumen = document.querySelector('#resumen')
    divResumen.classList.remove('hidden')

    const platillosContenido = document.querySelector('#platillos .contenido')

    
    platillos.forEach(platillo => {

        const divPlatillo = document.createElement('DIV')
        divPlatillo.classList.add("grid", "grid-cols-12", "px-4", "text-left", "border-y", "p-2")

        const nombrePlatillo = document.createElement('DIV')
        nombrePlatillo.classList.add('col-span-4')
        nombrePlatillo.textContent = platillo.nombre

        const precioPlatillo = document.createElement('DIV')
        precioPlatillo.classList.add('col-span-3')
        precioPlatillo.textContent = `$${platillo.precio}`

        const categoriaPlatillo = document.createElement('DIV')
        categoriaPlatillo.classList.add('col-span-3')
        categoriaPlatillo.textContent = `${categoria[platillo.categoria]}`

        const divCantidad = document.createElement('DIV')
        divCantidad.classList.add("col-span-2", "flex", "justify-center")

        const inputCantidad = document.createElement('INPUT')
        inputCantidad.classList.add("w-20", "py-1")
        inputCantidad.type = 'number'
        inputCantidad.min = 0
        inputCantidad.value = 0
        inputCantidad.id = `producto-${platillo.id}`
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value)
            agregarPlatilloResumen({...platillo, cantidad})
        }

        divCantidad.appendChild(inputCantidad)

        divPlatillo.appendChild(nombrePlatillo)
        divPlatillo.appendChild(precioPlatillo)
        divPlatillo.appendChild(categoriaPlatillo)
        divPlatillo.appendChild(divCantidad)

        platillosContenido.appendChild(divPlatillo)
        
    });
    
}

function agregarPlatilloResumen(producto) {
    
    let {pedido} = cliente

    if (producto.cantidad > 0) {
        
        if (pedido.some(articulo => articulo.id === producto.id)) {
        
            const articuloActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad
                }
    
                return articulo
            });
    
            cliente.pedido = [...articuloActualizado]
    
        }else{
            cliente.pedido = [...pedido, producto]
        }

    }else{
        const resultado = pedido.filter(articulo => articulo.id !== producto.id)

        cliente.pedido = [...resultado]
    }

    limpiarHtml()

    if (cliente.pedido.length) {
        mostrarResumen()
    }else{
        mensajePedidoVacio()
    }   
    
    
}

function mostrarResumen() {
    const contenido = document.querySelector('#resumen .contenido')

    const resumenPlatillos = document.createElement('DIV')
    resumenPlatillos.classList.add('col-span-1','shadow', 'container', 'bg-white', 'px-4', 'py-2')

    const heading = document.createElement('H3')
    heading.classList.add('text-center', 'text-xl')
    heading.textContent = 'Platillos consumidos'

    const mesa = document.createElement('P')
    mesa.textContent = 'Mesa: '

    const mesaSpan = document.createElement('SPAN')
    mesaSpan.classList.add('font-bold')
    mesaSpan.textContent = cliente.mesa
    
    const hora = document.createElement('P')
    hora.textContent = 'Hora: '

    const horaSpan = document.createElement('SPAN')
    horaSpan.classList.add('font-bold')
    horaSpan.textContent = cliente.hora

    const lista = document.createElement('UL')
    lista.classList.add('list-none')

    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)

    const {pedido} = cliente

    pedido.forEach(articulo => {
        const {nombre, precio, cantidad, id} = articulo        

        const itemLista = document.createElement('LI')
        itemLista.classList.add('shadow', 'pt-5', 'border','px-2')

        const articulonombre = document.createElement('H4')
        articulonombre.classList.add('text-xl')
        articulonombre.textContent = nombre

        const articuloCantidad = document.createElement('P')
        articuloCantidad.classList.add('font-bold')
        articuloCantidad.textContent= 'Cantidad: '

        const cantidadSpan = document.createElement('SPAN')
        cantidadSpan.classList.add('font-normal')
        cantidadSpan.textContent = cantidad

        const articuloPrecio = document.createElement('P')
        articuloPrecio.classList.add('font-bold')
        articuloPrecio.textContent= 'Precio: '

        const precioSpan = document.createElement('SPAN')
        precioSpan.classList.add('font-normal')
        precioSpan.textContent =`$${precio}`

        const articuloSubtotal = document.createElement('P')
        articuloSubtotal.classList.add('font-bold')
        articuloSubtotal.textContent= 'Subtotal: '

        const subtotalSpan = document.createElement('SPAN')
        subtotalSpan.classList.add('font-normal')
        subtotalSpan.textContent = calcularSubtotal(precio, cantidad)

        const btnEliminarArticulo = document.createElement('BUTTON')
        btnEliminarArticulo.classList.add('p-2', 'bg-red-100', 'text-red-500', 'rounded', 'my-2')
        btnEliminarArticulo.textContent = 'Eliminar Platillo'

        btnEliminarArticulo.onclick = function () {
            eliminarProducto(id)
        }

        articuloCantidad.appendChild(cantidadSpan)
        articuloPrecio.appendChild(precioSpan)
        articuloSubtotal.appendChild(subtotalSpan)

        itemLista.appendChild(articulonombre)
        itemLista.appendChild(articuloCantidad)
        itemLista.appendChild(articuloPrecio)
        itemLista.appendChild(articuloSubtotal)
        itemLista.appendChild(btnEliminarArticulo)

        lista.appendChild(itemLista)
    });

    resumenPlatillos.appendChild(heading)
    resumenPlatillos.appendChild(mesa)
    resumenPlatillos.appendChild(hora)
    resumenPlatillos.appendChild(lista)

    contenido.appendChild(resumenPlatillos)

    formularioPropinas()

}

function limpiarHtml() {

    const contenido = document.querySelector('#resumen .contenido')

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild)
    }
}

function calcularSubtotal(precio, cantidad) {
    return `$${precio*cantidad}`
}

function mensajePedidoVacio() {
    
    const contenido = document.querySelector('#resumen .contenido')
    
    const mensaje = document.createElement('P')
    mensaje.classList.add("text-center", "col-span-2")
    mensaje.textContent = 'Añade los elementos del pedido'

    contenido.appendChild(mensaje)
}

function eliminarProducto(id) {
    
    const {pedido} = cliente

    const pedidoActualizado = pedido.filter(producto => producto.id !== id)

    cliente.pedido = [...pedidoActualizado]

    limpiarHtml()

    if (cliente.pedido.length) {
        mostrarResumen()
    }else{
        mensajePedidoVacio()
    }

    const productoEliminado = `#producto-${id}`
    const inputEliminado = document.querySelector(productoEliminado)
    inputEliminado.value = 0

}

function formularioPropinas() {
    
    const contenido = document.querySelector('#resumen .contenido')

    const propinasDiv = document.createElement('DIV')
    propinasDiv.classList.add('col-span-1','shadow', 'bg-white', 'px-4', 'py-2','h-[20vh]','formulario-propinas')

    const heading = document.createElement('H3')
    heading.classList.add('text-center', 'text-xl')
    heading.textContent = 'Propina'

    const input10Div = document.createElement('DIV')
    
    const input10 = document.createElement('input')
    input10.name = 'propina'
    input10.type = 'radio'
    input10.value= 10
    input10.onchange = calcularPropina

    const input10Label = document.createElement('LABEL')
    input10Label.textContent = '10%'

    const input25Div = document.createElement('DIV')
    
    const input25 = document.createElement('input')
    input25.name = 'propina'
    input25.type = 'radio'
    input25.value= 25
    input25.onchange = calcularPropina

    const input25Label = document.createElement('LABEL')
    input25Label.textContent = '25%'

    const input50Div = document.createElement('DIV')
    
    const input50 = document.createElement('input')
    input50.name = 'propina'
    input50.type = 'radio'
    input50.value= 50
    input50.onchange = calcularPropina

    const input50Label = document.createElement('LABEL')
    input50Label.textContent = '50%'

    input10Div.appendChild(input10)
    input10Div.appendChild(input10Label)

    input25Div.appendChild(input25)
    input25Div.appendChild(input25Label)

    input50Div.appendChild(input50)
    input50Div.appendChild(input50Label)

    propinasDiv.appendChild(heading)
    propinasDiv.appendChild(input10Div)
    propinasDiv.appendChild(input25Div)
    propinasDiv.appendChild(input50Div)

    contenido.appendChild(propinasDiv)
}

function calcularPropina() {
    
    const {pedido} = cliente

    let subtotal = 0

    pedido.forEach(producto => {
        subtotal += producto.cantidad*producto.precio        
    });

    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value

    const propina = (subtotal*parseInt(propinaSeleccionada))/100
    
    const total = subtotal + propina
    
    mostrarHtml(subtotal, total, propina)
    
}

function mostrarHtml(subtotal, total, propina) {
    
    const contenedorPropinas = document.querySelector('.formulario-propinas')

    const bodyPropinasPrevia = document.querySelector('.datos-consumo')
    
    if (bodyPropinasPrevia) {
        bodyPropinasPrevia.remove()
    }

    const bodyPropinas = document.createElement('DIV')
    bodyPropinas.classList.add('datos-consumo')
    
    const subtotalElemento = document.createElement('P')
    subtotalElemento.classList.add('font-bold')
    subtotalElemento.textContent = 'Subtotal: '

    const subtotalSpan = document.createElement('SPAN')
    subtotalSpan.classList.add('font-normal')
    subtotalSpan.textContent = `$${subtotal}`

    const propinaElemento = document.createElement('P')
    propinaElemento.classList.add('font-bold')
    propinaElemento.textContent = 'Propina: '

    const propinaSpan = document.createElement('SPAN')
    propinaSpan.classList.add('font-normal')
    propinaSpan.textContent = `$${propina}`

    const totalElemento = document.createElement('P')
    totalElemento.classList.add('font-bold')
    totalElemento.textContent = 'Total: '

    const totalSpan = document.createElement('SPAN')
    totalSpan.classList.add('font-normal')
    totalSpan.textContent = `$${total}`

    subtotalElemento.appendChild(subtotalSpan)
    propinaElemento.appendChild(propinaSpan)
    totalElemento.appendChild(totalSpan)

    bodyPropinas.appendChild(subtotalElemento)
    bodyPropinas.appendChild(propinaElemento)
    bodyPropinas.appendChild(totalElemento)

    contenedorPropinas.appendChild(bodyPropinas)


}