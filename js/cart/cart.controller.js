import { CartModel } from "./cart.model.js";
import { CartView } from "./cart.view.js";

class CartController {
  constructor() {
    this.cart = new CartModel(JSON.parse(localStorage.getItem("cart") || "[]"));
    this.itemsData = [];
    this.view = new CartView(this.cart);
  }

  initView(items) {
    if (!this.view) {
      throw new Error("Cart view not initialized.");
    }
    this.view.init();
    this.itemsData = items;
  }

  addItem(item) {
    const itemData = this.itemsData.find((i) => i.id === item.id);
    console.log("Adding item to cart:", itemData);
    this.cart.addItem({
      ...itemData,
      quantity: item.quantity || 1,
    });
    this.updateCartDisplay();
  }

  removeItem(itemId) {
    this.cart.removeItem(itemId);
    this.updateCartDisplay();
  }

  getItems() {
    return this.cart.getItems();
  }

  clearCart() {
    this.cart.clearItems();
    this.updateCartDisplay();
  }

  getCartCount() {
    return this.cart.getItems().length;
  }

  getTotalPrice() {
    return this.cart.getTotalPrice();
  }

  getTotalPriceTTC() {
    return this.cart.getTotalPriceTTC();
  }

  updateCartDisplay() {
    this.view.render();
  }

  showCartSidebar() {
    this.view.displayCartSidebar(true);
  }
}

export { CartController };
