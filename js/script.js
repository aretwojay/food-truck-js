import { CartController } from "./cart/cart.controller.js";
import { ItemController } from "./item/item.controller.js";
import { OrderController } from "./order/order.controller.js";

const cartController = new CartController();
const itemController = new ItemController(cartController);
const orderController = new OrderController(cartController);

document.addEventListener("DOMContentLoaded", async () => {
  const items = await itemController.getItems();
  cartController.initView(items);
  itemController.initView(items);
});
