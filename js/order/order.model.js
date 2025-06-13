import { CartModel } from "../cart/cart.model.js";
import { ORDER_STATUSES } from "../constants.js";

class OrderModel {
  constructor({ id = Date.now(), status = ORDER_STATUSES[0], items = [] }) {
    this.id = id; // Unique ID based on timestamp
    this.cart = new CartModel(items);
    this.status = status; // Default status
  }
}

export { OrderModel };
