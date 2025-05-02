if('serviceWorker'in navigator){
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('/service-worker.js').then(registration=>{
            console.log('Service Worker registrado correctamente',registration.scope)
        }).catch(error=>{
            console.error('Error al registrar el service worker: ',error);
        });
        
    });
}