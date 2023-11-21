import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const jsonFilePath = './src/Productos.json';  // Asegúrate de proporcionar la ruta correcta
const productManager = new ProductManager(jsonFilePath);
await productManager.init();

// Definir las rutas para el manejo de productos

// Obtener todos los productos
router.get('/', async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit); // el método getProducts de ProductManager para obtener todos los productos, considerando el límite si se proporciona
        console.log('Productos obtenidos:', products);
        res.json({ products }); // caso de éxito, devolvemos productos en formato json
    } catch (error) {
        console.error('Error al procesar la solicitud.', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

// Obtener un producto por ID
router.get('/:pid', async(req, res) => {
    try {
        const productId = parseInt(req.params.pid); // obtiene el ID del producto de los parámetros de la URL.
        const product = await productManager.getProductById(productId); // el método getProductById de la instancia de ProductManager obtiene el producto correspondiente

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        };

        console.log('Producto obtenido por ID:', product);
        res.json({ product }); // producto encontrado
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

// Agregando un nuevo producto en el endpoint '/products'
router.post('/', async(req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status = true,  // status es true por defecto
        } = req.body; //req.body obtiene los datos del producto del cuerpo de la solicitud

        // Verifica si todos los campos obligatorios están presentes
        if (!title || !description || !code || !price || !stock || !category) {
            res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            return;
        };

        // Verifica si ya existe un producto con el mismo código
        if (productManager.getProducts(code)) {
            res.status(400).json({ error: `Ya existe un producto con el código ${code}.` });
            return;
        };

        // Agregar el nuevo producto (Llamando al método addProduct de la instancia de ProductManager para agregar el nuevo producto)
        await productManager.addProduct(title, description, price, thumbnails, code, stock, category, status);
        //await productManager.addProduct('Producto 1', 'Descripción 1', 100, 'imagen1.jpg', 'code1', 10, 1000, 'cat1', true);
        //await productManager.addProduct('Producto 2', 'Descripción 2', 150, 'imagen2.jpg', 'code2', 15, 1000, 'cat2', true);
        //await productManager.addProduct('Producto 3', 'Descripción 3', 200, 'imagen3.jpg', 'code3', 20, 1000, 'cat3', true);
        //await productManager.addProduct('Producto 4', 'Descripción 4', 250, 'imagen4.jpg', 'code4', 25, 1000, 'cat4', true);
        //await productManager.addProduct('Producto 5', 'Descripción 5', 300, 'imagen5.jpg', 'code5', 30, 1000, 'cat5', true);
        //await productManager.addProduct('Producto 6', 'Descripción 6', 350, 'imagen6.jpg', 'code6', 35, 1000, 'cat6', true);
        //await productManager.addProduct('Producto 7', 'Descripción 7', 400, 'imagen7.jpg', 'code7', 40, 1000, 'cat7', true);
        //await productManager.addProduct('Producto 8', 'Descripción 8', 450, 'imagen8.jpg', 'code8', 45, 1000, 'cat8', true);
        //await productManager.addProduct('Producto 9', 'Descripción 9', 500, 'imagen9.jpg', 'code9', 50, 1000, 'cat9', true);
        //await productManager.addProduct('Producto 10', 'Descripción 10', 550, 'imagen10.jpg', 'code10', 55, 1000, 'cat10', true);

        console.log('Nuevo producto agregado correctamente.');
        res.json({ message: 'Nuevo producto agregado correctamente.' }); // caso de éxito
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

// Actualizar un producto por ID en el endpoint /products/:pid
router.put('/:pid', async(req, res) => {
    try {
        const productId = parseInt(req.params.pid); // parseInt(req.params.pid) obtiene el ID del producto de los parámetros de la URL
        const existingProduct = await productManager.getProductById(productId);

        // Verifica si el producto existe
        if (!existingProduct) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        };

        // Extrae los campos que se van a actualizar del cuerpo de la solicitud
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        // Actualiza los campos del producto
        existingProduct.title = title || existingProduct.title;
        existingProduct.description = description || existingProduct.description;
        existingProduct.code = code || existingProduct.code;
        existingProduct.price = price || existingProduct.price;
        existingProduct.stock = stock || existingProduct.stock;
        existingProduct.category = category || existingProduct.category;
        existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;
        existingProduct.status = status !== undefined ? status : existingProduct.status;

        // Guarda los cambios
        await productManager.saveData();

        console.log(`Producto con ID ${productId} actualizado correctamente.`);
        res.json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

// Eliminar un producto por ID
router.delete('/:pid', async(req, res) => {
    try {
        const productId = parseInt(req.params.pid); // parseInt(req.params.pid) obteniene el ID del producto de los parámetros de la URL
        const existingProductIndex = productManager.getProducts(productId); // Obtenemos el índice del producto en el array de productos utilizando el método getProductIndexById de ProductManager

        // Verifica si el producto existe
        if (existingProductIndex === -1) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        };

        // Elimina el producto del array de productos
        productManager.products.splice(existingProductIndex, 1);

        // Guarda los cambios
        await productManager.saveData();

        console.log(`Producto con ID ${productId} eliminado correctamente.`);
        res.json({ message: `Producto con ID ${productId} eliminado correctamente.` });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

export default router;

