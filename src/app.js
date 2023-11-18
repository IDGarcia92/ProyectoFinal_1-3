const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const PORT = 8080;

const jsonFilePath = './Productos.json';
const productManager = new ProductManager(jsonFilePath);

// Inicializar la instancia y cargar los datos existentes
productManager.init().then(() => {
    console.log('ProductManager inicializado correctamente.');

    // Middleware para parsear el cuerpo de las peticiones como JSON
    app.use(express.json());

    // Endpoint para obtener todos los productos, con opción de limitar la cantidad 
    app.get('/products', async (request, response) => {
        try {
            const limit = request.query.limit ? parseInt(request.query.limit) : undefined;
            const products = await productManager.getProducts(limit);
            console.log('Productos obtenidos:', products);
            response.json({ products });
        } catch (error) {
            console.error('Error al procesar la solicitud.', error);
            response.status(500).json({ error: 'Error interno del servidor.' });
        }
    });

    // Endpoint para obtener un producto por ID
    app.get('/products/:id', async (request, response) => {
        try {
            const productId = parseInt(request.params.id);
            const product = await productManager.getProductById(productId);
            if (!product) {
                response.status(404).json({ error: 'Producto no encontrado.' });
                return;
            }
            console.log('Producto obtenido por ID:', product);
            response.json({ product });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            response.status(500).json({ error: 'Error interno del servidor.' });
        }
    });

    // Agregando productos
    productManager.addProduct('Producto 1', 'Descripción 1', 100, 'imagen1.jpg', 'code1', 10);
    productManager.addProduct('Producto 2', 'Descripción 2', 150, 'imagen2.jpg', 'code2', 15);
    productManager.addProduct('Producto 3', 'Descripción 3', 200, 'imagen3.jpg', 'code3', 20);
    productManager.addProduct('Producto 4', 'Descripción 4', 250, 'imagen4.jpg', 'code4', 25);
    productManager.addProduct('Producto 5', 'Descripción 5', 300, 'imagen5.jpg', 'code5', 30);
    productManager.addProduct('Producto 6', 'Descripción 6', 350, 'imagen6.jpg', 'code6', 35);
    productManager.addProduct('Producto 7', 'Descripción 7', 400, 'imagen7.jpg', 'code7', 40);
    productManager.addProduct('Producto 8', 'Descripción 8', 450, 'imagen8.jpg', 'code8', 45);
    productManager.addProduct('Producto 9', 'Descripción 9', 500, 'imagen9.jpg', 'code9', 50);
    productManager.addProduct('Producto 10', 'Descripción 10', 550, 'imagen10.jpg', 'code10', 55);


    // Verificando que los productos se carguen correctamente
    productManager.getProducts().then((products) => {
            console.log('Productos cargados:', products);
        }).catch((error) => {
            console.error('Error al obtener productos:', error);
    });

    // Iniciando el servidor después de cargar los datos
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });

}).catch((error) => {
    console.error('Error al inicializar ProductManager:', error);
});
