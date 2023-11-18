const fs = require("fs").promises;

class ProductManager {
    constructor(jsonFilePath) {
        this.jsonFilePath = jsonFilePath;
        this.products = [];
        this.lastId = 0;
    };

    async init() {
        try {
            const data = await fs.readFile(this.jsonFilePath, 'utf-8');
            this.products = JSON.parse(data);
            // Encontrar el último ID al inicializar
            this.lastId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            } catch (error) {
            // Si hay un error al leer el archivo, asumimos que es porque no existe
            // o está vacío, y lo manejamos creando un nuevo archivo.
            await this.saveData();
        };
    };
    async saveData() {
        await fs.writeFile(this.jsonFilePath, JSON.stringify(this.products, null, 2), 'utf-8');
    };
    async addProduct(title, description, price, thumbnail, code, stock) {
        const newProduct = {
            id: ++this.lastId, // Incrementar el último ID y asignarlo al nuevo producto
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
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
};
module.exports = ProductManager;
