import { promises as fsPromises } from 'fs';

class ProductManager {
    constructor(jsonFilePath) {
        this.jsonFilePath = jsonFilePath;
        this.products = [];
        this.lastId = 0;
        this.init();
    };
    
    async init() {
        try {
            // Verificar la existencia del archivo
            await fsPromises.access(this.jsonFilePath);
            const data = await fsPromises.readFile(this.jsonFilePath, 'utf-8');
            this.products = JSON.parse(data);
            // Encuentra el último ID al inicializarse
            this.lastId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            } catch (error) {
                console.error('Error al inicializar ProductManager:', error);
                // Si hay un error al leer el archivo, asumimos que es porque no existe
                // o está vacío, y lo manejamos creando un nuevo archivo.
                await this.saveData();
        };
    };

    async saveData() {
        await fsPromises.writeFile(this.jsonFilePath, JSON.stringify(this.products, null, 2), 'utf-8');
    };
    async addProduct(title, description, price, thumbnail, code, stock, category, status) {
        const newProduct = {
            id: ++this.lastId, // Incrementar el último ID y asignarlo al nuevo producto
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status
        };
        // Verificando si ya existe un producto con el mismo código
        if (this.products.some(product => product.code === code)) {
            console.log(`El producto con el código ${code} ya existe.`);
            return;
            };

        this.products.push(newProduct);
        await this.saveData();
    };
    async getProducts(limit) {
        // Retornar productos limitados si se especifica un límite
        return limit ? this.products.slice(0, limit) : this.products;
    };
    async getProductById(productId) {
        return this.products.find(product => product.id === productId);
    };

    async deleteProduct(id) {

        const productIndex = this.products.findIndex((p) => p.id === id);
        
        if (productIndex === -1) {
        
        return { error: 'Producto no encontrado.' };
        
        }
        
        this.products.splice(productIndex, 1);
        
        await this.saveData();
        
        }
};
export default ProductManager;