import express from 'express';
import productsRouter from './routes/products.router.js'; 
import cartsRouter from './routes/carts.router.js';  

const app = express();
const PORT = 8080;

//Middlewares
app.use(express.json()); //recibe las peticiones POST // evita undefined
app.use(express.urlencoded({extended:true})); //recibe los datos de las peticiones POST //evita {} objeto vacío

// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

// Iniciando el servidor después de cargar los datos
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});