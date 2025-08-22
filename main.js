// Captura la información del nombre del implemento en el formulario
function activarNombre() {
    const implemento = document.querySelector('#implemento_name');
    return implemento.value;
}
// Captura la información del nombre de la categoria en el formulario
function activarCategoria() {
    const categoria = document.querySelector('#categoria');
    return categoria.value;
}
// Captura la información del nombre del departamento en el formulario
function activarDepartamento() {
    const inventario = document.querySelector('#departamento');
    return inventario.value;
}
// Captura la información del nombre de la condición en el formulario
function activarCondicion() {
    const inventario = document.querySelector('#condicion');
    return inventario.value;
}
// Captura la información del nombre del propietario en el formulario
function activarPertenencia() {
    const inventario = document.querySelector('#pertenencia');
    return inventario.value;
}
// Captura la información del nombre de la cantidad en el formulario
/*function activarCantidad(){
    const inventario = document.querySelector('#cantidad');
    if (Number(inventario.value) < 1){
        alert("La cantidad debe ser mayor a 0");
        return;
    }
    console.log(inventario.value);
    return inventario.value;
}*/

// Captura la información del nombre del valor en el formulario
function activarValor() {
    const inventario = document.querySelector('#valor');
    if (Number(inventario.value) < 10000) {
        alert("El valor debe ser mayor a 10000")
        inventario.reset();
        return;
    }
    console.log(inventario.value);
    return inventario.value;
}
// Captura la información del nombre de la fecha en el formulario
function activarFecha() {
    const inventario = document.querySelector('#fecha');
    return inventario.value;
}

function idImplemento() {
    return fetch(`http://localhost:3000/api/inventario/implemento`)
        .then(res => res.json())
        .then(implementos => {
            if (categoria === "Muebles"){
                const cat = implementos.filter(items => item.categoria === "Muebles").lenght();
                id_implemento = `ARCSAS-M${cat + 1}`;
                resolve(id_implemento);
            }
            else{
                const cat = implementos.filter(categoria === "Equipos de Computo").count();
                id_implemento = `ARCSAS-T${cat + 1}`;
                return id_implemento;
            }
        })
        .catch(err => {
            console.error('❌ Error al generar el ID:', err);
            return null;
        });
}

async function mostrarConteo() {
  try {
    const totalMuebles = await contarMueblesDesdeAPI();
    const totalEquipos = await contarEquiposDesdeAPI();
    console.log(`"Muebles" aparece ${totalMuebles} veces.`);
    console.log(`"Equipos de Computo" aparece ${totalEquipos} veces.`);
  } catch (error) {
    console.error("Error al contar los muebles:", error);
  }
}

function contarMueblesDesdeAPI() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/inventario/implemento')
      .then(res => res.json())
      .then(data => {
        const totalm = data.filter(item => item.categoria === "Muebles").length;
        resolve(totalm);
      })
      .catch(error => reject(error));
  });
}

function contarEquiposDesdeAPI() {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:3000/api/inventario/implemento')
      .then(res => res.json())
      .then(data => {
        const totale = data.filter(item => item.categoria === "Equipos de Computo").length;
        resolve(totale);
      })
      .catch(error => reject(error));
  });
}


async function idMuebles() {
  try {
    const totalMuebles = await contarMueblesDesdeAPI();
    let id = 1000 + (totalMuebles + 1)
    let id_implemento = 'ARCSAS-M' + id;
    console.log(`ID del implemento de muebles: ${id_implemento}`);
    console.log(`"Muebles" aparece ${totalMuebles} veces.`);
    return id_implemento;
  } catch (error) {
    console.error("Error al contar los muebles:", error);
  }
}

async function idEquipo() {
    try {
    const totalEquipos = await contarEquiposDesdeAPI();
    let id = 1000 + (totalEquipos + 1)
    let id_implemento = 'ARCSAS-T' + id;
    console.log(`ID del implemento de Equipos: ${id_implemento}`);
    console.log(`"Equipos" aparece ${totalEquipos} veces.`);
    return id_implemento;
  } catch (error) {
    console.error("Error al contar los muebles:", error);
  }
}

async function idImplementos(){
    categoria = activarCategoria();
    if (categoria === "Muebles") {
        return await idMuebles();
    }
    else{
        return await idEquipo();
    }

}
// Llamar la función
mostrarConteo();


//Inserta la información en la tabla del front
const tabla = document.querySelector('#tabla #tabla-body');

// Captura la información del formulario y la agrega a la tabla
const form = document.querySelector('#formulario');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const id_implemento = await idImplementos();
    const nombre = activarNombre();
    const categoria = activarCategoria();
    const departamento = activarDepartamento();
    const condicion = activarCondicion();
    const pertenencia = activarPertenencia();
    //const cantidad = activarCantidad();
    const valor = activarValor();
    //const total = activarValor() * activarCantidad();
    const fecha = activarFecha();
    console.log(id_implemento);
    console.log(nombre);
    /*agregarFila({
        id_implemento,
        nombre,
        categoria,
        departamento,
        condicion,
        pertenencia,
        //cantidad,
        valor,
        fecha,
        total,
    })*/

    const datos = {
        id_implemento,
        nombre,
        categoria,
        departamento,
        condicion,
        pertenencia,
        //cantidad,
        valor,
        fecha
    };
    enviarAlBackend(datos)
    limpiarFormulario();
})

// Inserta en cada fila de la tabla los datos del formulario
function agregarFila(formulario) {
    const fila = tabla.insertRow();
    fila.insertCell().textContent = formulario.id_implemento;
    fila.insertCell().textContent = formulario.nombre;
    fila.insertCell().textContent = formulario.categoria;
    fila.insertCell().textContent = formulario.departamento;
    fila.insertCell().textContent = formulario.condicion;
    fila.insertCell().textContent = formulario.pertenencia;
    //fila.insertCell().textContent = formulario.cantidad;
    fila.insertCell().textContent = formulario.valor;
    fila.insertCell().textContent = formulario.fecha;
    fila.insertCell().textContent = formulario.total;
    limpiarFormulario();
}


// Limpia el formulario después de agregar la fila o darle click en el botónde limpiar
function limpiarFormulario() {
    document.querySelector('#formulario').reset();
}

function enviarAlBackend(datos) {
    fetch('http://localhost:3000/api/inventario/implemento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(res => res.json())
        .then(data => {
            console.log('✔ Enviado al backend:', data);
            alert(data.mensaje);
        })
        .catch(error => {
            console.error('❌ Error al enviar al backend:', error);
            alert('Error al guardar en la base de datos');
        });
}



function nombre(){
const name = document.querySelector("#implemento_name");
const categoria = document.querySelector("#categoria").value;
const url = `http://localhost:3000/api/inventario/cat_implemento/${encodeURIComponent(categoria)}`;
name.innerHTML = '<option value="" disabled selected>Seleccione el implemento</option>';
    fetch(url,{
        method: 'GET',
    })
        .then(res => res.json())
        .then(lista_cat =>{
            for (let implemento of lista_cat) {
                let nuevaOpcion = document.createElement("option");
                nuevaOpcion.value = implemento.nom_implemento;
                nuevaOpcion.text = implemento.nom_implemento;
                name.add(nuevaOpcion);
            }
        })
        .catch(function (error) {
            console.error("¡Error!", error);
        });
} 


function recorrerDepartamentos() {
const select = document.querySelector("#departamento");
const url = 'http://localhost:3000/api/inventario/departamento';
    fetch(url, {
        method: 'GET',
    })
        .then(res => res.json())
        .then(lista_de_departamentos => {
            for (let departamento of lista_de_departamentos) {
                let nuevaOpcion = document.createElement("option");
                nuevaOpcion.value = departamento.id;
                nuevaOpcion.text = departamento.nombre;
                select.add(nuevaOpcion);
            }
        })
        .catch(function (error) {
            console.error("¡Error!", error);
        });
}

function recorrerImplementos(){
const select = document.querySelector("#categoria");
const url = 'http://localhost:3000/api/inventario/cat_implemento';
    fetch(url,{
        method: 'GET',
    })
        .then(res => res.json())
        .then(lista_cat =>{
            for (let implemento of lista_cat){
                let nuevaOpcion = document.createElement("option");
                nuevaOpcion.value = implemento.id;
                nuevaOpcion.text = implemento.nombre;
                select.add(nuevaOpcion);
            }
        })
        .catch(function (error){
            console.error("¡Error!", error);
        })
}

function activarEstado(){
    const url = 'http://localhost:3000/api/inventario/departamento';
    fetch(url, {
        method: 'GET',
    })
        .then(res => res.json())
        .then(implemento =>{
            for (let estado of implemento){          
                
        }
    })
        .catch(function (error) {
            console.error("¡Error!", error);
        }
    );
}