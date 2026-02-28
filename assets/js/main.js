console.log('Estamos conectados');

/*
----------------------------------
Configutación 
----------------------------------
*/

const IVA = 0.19;

/*
----------------------------------
Datos Semilla
----------------------------------
*/

let inventario = [
    {
        id: crypto.randomUUID(),
        nombre : "Teclado Inalambrico",
        categoria : "Periféricos",
        precio: 15000,
        stock: 10
    },
    {
        id: crypto.randomUUID(),
        nombre : "Mouse Inalambrico",
        categoria : "Periféricos",
        precio: 8000,
        stock: 25
    },
    {
        id: crypto.randomUUID(),
        nombre : "Monitor 24 pulgadas",
        categoria : "Monitores",
        precio: 45000,
        stock: 5
    }
];

/*
----------------------------------
Utils
----------------------------------

*/

// 

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(price)
}

const actualizarInventario = () => {

    // 
    const subTotal = inventario.reduce((accum, producto) => {
        return accum + (producto.precio * producto.stock);
    },0);

    // 
    const ivaSubTotal = subTotal * IVA;

    // 
    const total = subTotal + ivaSubTotal;
    
    //
    document.querySelector('#subtotal').textContent = formatPrice(subTotal);
    document.querySelector('#iva').textContent = formatPrice(ivaSubTotal);
    document.querySelector('#total').textContent = formatPrice(total);

};

/*
----------------------------------
CRUD 
----------------------------------
*/

const crearProducto = (nombre, categoria, precio, stock) => {
    const nuevoProducto = {
        id: crypto.randomUUID(),
        nombre,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock)
    };

    inventario.push(nuevoProducto);
    render();
}

const eliminarProducto = (id) => {
    inventario = inventario.filter(producto => producto.id !== id);
    render();
}



/*
----------------------------------
Referencias del DOM
----------------------------------
*/

const tablaProductos = document.querySelector('#tabla-productos');
const productForm = document.querySelector('#btnAgregar');

const nombreInput = document.querySelector('#nombre');
const categoriaInput = document.querySelector('#categoria');
const precioInput = document.querySelector('#precio');
const stockInput = document.querySelector('#stock');


/*
----------------------------------
Componentes 
----------------------------------
*/

// 

 const createTableHTML = (datos = inventario) => { 
   const filasArray = datos.map(
   (producto) => `
        <tr class="text-center align-middle">
            <td class="p-3">
                <div class="fw-bold">${producto.nombre}</div>
                <div class="text-muted small" style="font-size: 0.7rem;">ID:${producto.id.slice(0, 8)}</div>
            </td>
            <td class="small">${producto.categoria}</td>
            <td class="p-3 fw-bold">${formatPrice(producto.precio)}</td>

            <td class="p-3">
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <button class="btn-control-stock btn-menos" data-action="desc" data-id="${producto.id}">-</button>
                    <span class="stock-valor">${producto.stock}</span>
                    <button class="btn-control-stock btn-mas" data-action="inc" data-id="${producto.id}">+</button>
                </div>
            </td>
            
            <td class="p-3">
                <button class="btn btn-sm text-danger" data-action="delete" data-id="${producto.id}">
                Eliminar
                </button>
            </td>
        </tr>

        `);

        return filasArray.join('');
};


/*
----------------------------------
Render
----------------------------------
*/


const render = (datosMostrar = inventario) => {
    tablaProductos.innerHTML = "";

    const htmlString = createTableHTML(datosMostrar);

    tablaProductos.innerHTML = htmlString;

    actualizarInventario();
};

render();


/*
----------------------------------
Listeners
----------------------------------
*/

document.querySelector('#btnAgregar').addEventListener('click', (event) => {

    event.preventDefault();

    const nombre = nombreInput.value;
    const categoria = categoriaInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    if(!nombre || !categoria || !precio || !stock) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    crearProducto(nombre, categoria, precio, stock);

    // 
    nombreInput.value = '';
    categoriaInput.value = '';
    precioInput.value = '';
    stockInput.value = '';

});

tablaProductos.addEventListener('click', (event) => {
    const button = event.target.closest("button[data-action]"); 
    if (!button) return;
    
    const id = button.dataset.id;
    const action = button.dataset.action;

    const producto = inventario.find(producto => producto.id === id);

    if (producto) {
        if (action === 'inc') {
            producto.stock++;
        } 
        
        else if (action === 'desc') {
            producto.stock--;
            
            if (producto.stock <= 0) {
                inventario = inventario.filter(producto => producto.id !== id);
            }  
        } 
        
        else if (action === 'delete') {
            inventario = inventario.filter(producto => producto.id !== id);
        }
       
        render(); 
    }
});

/*
----------------------------------
Búsqueda
----------------------------------
*/
const busquedaInput = document.querySelector('#busqueda');

busquedaInput.addEventListener('input', (event) => {
    const valorBusqueda = event.target.value.toLowerCase();

    const productosFiltrados = inventario.filter(producto => 
        producto.nombre.toLowerCase().includes(valorBusqueda) || 
        producto.categoria.toLowerCase().includes(valorBusqueda)
    );

    render(productosFiltrados);
});