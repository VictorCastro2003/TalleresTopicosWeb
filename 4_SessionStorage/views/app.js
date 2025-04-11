//Guardar Nombre del usuario de SessionStorage
function saveUser (){
    const username = document.getElementById('username').value;
    sessionStorage.setItem('username',username);
    alert('Nombre de usuario guardado en SessionStorage');
}

//Cargar el nombre de usuario desde SessionStorage

function loadUsername(){
    const storedUsername = sessionStorage.getItem('username');
    const usernameDisplay=document.getElementById('username-display');
    
    if(storedUsername){
        usernameDisplay.textContent=`Nombre usuario almacenado: ${storedUsername}`;
    }else{
        usernameDisplay.textContent=`No hay nombre de usuario guardado en SessionStorage`;
    }
}