const { response } = require("express");

const CACHE_NAME='formulario-cache';

const urlsToCache=[
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/success.html'
];
self.addEventListener('install',event=>{
    console.log('Instalando');

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache=>{
            console.log('Cacheando archivos');
            return cache.addAll(urlsToCache);
        })
    );
});
self.addEventListener('activate',event=>{
    console.log('Activando');

    event.waitUntil(
        caches.keys().then(cacheNames=>{
            return Promise.all(
                cacheNames.map(name=>{
                    if(name!==CACHE_NAME){
                        console.log('Borrando cache antiguo: ',name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch',event=>{
    const {request}=event;
    if(request.method==='POST'){
        event.respondWith(
            fetch(request).catch(()=>{
                return caches.match('/success.html');
            })
        );
    }else{
        event.respondWith(
            caches.match(request).then(response=>{
                return response || fetch(request);
            })
        );
    }
});