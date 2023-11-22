// CartManager.js
import fs from 'fs/promises';

class CartManager {
    constructor(jsonFilePath) {
        this.jsonFilePath = jsonFilePath;
        this.carts = [];
        this.lastCartId = 0;
        this.carts;
    };

    async init() {
        try {
            const data = await fs.readFile(this.jsonFilePath, 'utf-8');
            this.carts = JSON.parse(data);
            // Encuentra el último ID al inicializarse
            this.lastCartId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
        } catch (error) {
            // Si hay un error al leer el archivo, asumimos que es porque no existe o está vacio, y lo manejamos creando un nuevo archivo.
            await this.saveData();
        };
    };

    async saveData() {
        await fs.writeFile(this.jsonFilePath, JSON.stringify(this.carts, null, 2), 'utf-8');
    };

    async createCart() {
        const newCart = {
            id: ++this.lastCartId,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveData();
        return newCart;
    };

    getCartIndexById(cartId) {
        return this.carts.findIndex(cart => cart.id === cartId);
    };

    async getCartById(cartId) {
        const cartIndex = this.getCartIndexById(cartId);
        return cartIndex !== -1 ? this.carts[cartIndex] : null;
    };

};

export default CartManager;

