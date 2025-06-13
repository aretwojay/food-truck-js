class CartModel {
  constructor(items = []) {
    this.items = items;
  }

  addItem(item) {
    const existingItem = this.items.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(this.items));
    console.log("Current items in cart:", this.items);
  }

  setItemQuantity(itemId, quantity) {
    const item = this.items.find((i) => i.id === itemId);
    console.log(item, quantity);
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
      } else {
        this.removeItem(itemId);
      }
    }
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  removeItem(itemId) {
    const item = this.items.find((i) => i.id === itemId);
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.items = this.items.filter((i) => i.id !== itemId);
    }
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  getItems() {
    return this.items;
  }

  clearItems() {
    this.items = [];
    localStorage.removeItem("cart");
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getTotalPriceTTC() {
    const totalPrice = this.getTotalPrice();
    const taxRate = 0.2; // Example tax rate of 20%
    return totalPrice + totalPrice * taxRate;
  }
}

export { CartModel };
