var bd;
var listaContactos;
var contactoEditando = null;

window.onload = function() {
    iniciarBD();
};

function iniciarBD(){
    var formularioBusqueda = document.querySelector('#formularioBusqueda');
    formularioBusqueda.addEventListener('submit', buscarContacto);
    listaContactos = document.querySelector('.cajaContacto');
    var btnGuardar = document.querySelector('#botonGuardar');
    btnGuardar.addEventListener('click', guardarContacto);

    var req = indexedDB.open('miBD', 1);
    req.onerror = function(event) {
        console.log("Error al abrir la BD", event);
    };
    req.onsuccess = function(event) {
        bd = event.target.result;
        mostrar();
    };
    req.onupgradeneeded = function(event) {
        var basededatos = event.target.result;
        var almacen = basededatos.createObjectStore('contactos', {keyPath: 'id'});
        almacen.createIndex('BuscarNombre', 'nombre', {unique: false});
    };
}

function guardarContacto(){
    var nombre = document.querySelector('#nombre').value;
    var id = document.querySelector('#id').value;
    var edad = document.querySelector('#edad').value;

    var transaccion = bd.transaction(['contactos'], 'readwrite');
    var almacen = transaccion.objectStore('contactos');

    transaccion.oncomplete = function() {
        mostrar();
        document.querySelector('#nombre').value = "";
        document.querySelector('#id').value = "";
        document.querySelector('#edad').value = "";
    };

    almacen.add({
        nombre: nombre,
        id: id,
        edad: edad
    });
}

function mostrar(){
    listaContactos.innerHTML = "";
    var transaccion = bd.transaction(['contactos'], 'readonly');
    var almacen = transaccion.objectStore('contactos');
    var cursor = almacen.openCursor();

    cursor.onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor){
            listaContactos.innerHTML += "<div>" +
                cursor.value.nombre + " | " + cursor.value.id + " | " + cursor.value.edad + 
                "<input type='button' class='botonEdit' value='Editar' onclick='seleccionarContacto(\"" + cursor.value.id + "\")'>" +
                "<input type='button' class='botonEdit' value='Borrar' onclick='eliminarContacto(\"" + cursor.value.id + "\")'><br><br>" +
                "</div>";
            cursor.continue();
        }
    };
}

function seleccionarContacto(key){
    var transaccion = bd.transaction(['contactos'], 'readonly');
    var almacen = transaccion.objectStore('contactos');
    var solicitud = almacen.get(key);

    solicitud.onsuccess = function() {
        var contacto = solicitud.result;
        if(contacto) {
            document.querySelector('#nombre').value = contacto.nombre;
            document.querySelector('#id').value = contacto.id;
            document.querySelector('#edad').value = contacto.edad;
            document.querySelector('#id').readOnly = true;
            
            var btnGuardar = document.querySelector('#botonGuardar');
            btnGuardar.value = "Actualizar";
            btnGuardar.onclick = function() { actualizarContacto(key); };
        }
    };
}

function actualizarContacto(key){
    var nombre = document.querySelector('#nombre').value;
    var id = document.querySelector('#id').value;
    var edad = document.querySelector('#edad').value;

    var transaccion = bd.transaction(['contactos'], 'readwrite');
    var almacen = transaccion.objectStore('contactos');

    transaccion.oncomplete = function() {
        mostrar();
        document.querySelector('#nombre').value = "";
        document.querySelector('#id').value = "";
        document.querySelector('#edad').value = "";
        document.querySelector('#id').readOnly = false;
        
        var btnGuardar = document.querySelector('#botonGuardar');
        btnGuardar.value = "Guardar";
        btnGuardar.onclick = guardarContacto;
    };

    almacen.put({
        nombre: nombre,
        id: id,
        edad: edad
    });
}

function buscarContacto(evento){
    evento.preventDefault();
    var buscar = document.querySelector('#buscarNombre').value;
    var resultado = document.querySelector('.resultadoBusqueda');
    resultado.innerHTML = "";

    var transaccion = bd.transaction(['contactos'], 'readonly');
    var almacen = transaccion.objectStore('contactos');
    var indice = almacen.index('BuscarNombre');
    var rango = IDBKeyRange.only(buscar);
    var cursor = indice.openCursor(rango);

    cursor.onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            resultado.innerHTML += "<div>" +
                cursor.value.nombre + " | " + cursor.value.id + " | " + cursor.value.edad + 
                "<input type='button' class='botonEdit' value='Editar' onclick='seleccionarContacto(\"" + cursor.value.id + "\")'>" +
                "<input type='button' class='botonEdit' value='Borrar' onclick='eliminarContacto(\"" + cursor.value.id + "\")'><br><br>" +
                "</div>";
            cursor.continue();
        }
    };
}

function eliminarContacto(key){
    if(confirm("¿Estás seguro de eliminar este contacto?")) {
        var transaccion = bd.transaction(['contactos'], 'readwrite');
        var almacen = transaccion.objectStore('contactos');
        almacen.delete(key);
        
        transaccion.oncomplete = function() {
            mostrar();
        };
    }
}