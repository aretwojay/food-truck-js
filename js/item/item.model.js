class ItemModel {
  constructor({ id, name, price, image }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = 1; // Default quantity
  }
}

export { ItemModel };
