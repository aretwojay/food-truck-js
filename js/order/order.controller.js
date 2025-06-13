import { ORDER_STATUSES } from "../constants.js";
import { OrderModel } from "./order.model.js";
import { OrderView } from "./order.view.js";

class OrderControllerError extends Error {
  constructor(message, options) {
    super(message, options);
  }
}

class OrderController {
  constructor(cartController) {
    this.cartController = cartController;
    this.view = new OrderView({ cartController, orderController: this });
    this.view.init();
  }

  getOrders() {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    return orders.map(
      (orderData) =>
        new OrderModel({
          items: orderData.cart.items,
          id: orderData.id,
          status: orderData.status,
        })
    );
  }

  setOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  cancelOrder(orderId) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex !== -1) {
      orders.splice(orderIndex, 1);
      this.setOrders(orders);
      console.log(`Order with ID ${orderId} has been canceled.`);
    } else {
      console.error(`Order with ID ${orderId} not found.`);
    }
  }

  async fakePostCommande() {
    const cart = this.cartController.cart;
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Fake order placed with items:", cart);
        resolve();
      }, 1000); // Simulate a delay for the fake order
    });

    const order = new OrderModel({
      items: cart.items,
    });

    const currentOrders = this.getOrders();
    const pendingOrders = currentOrders.filter(
      (order) => order.status === ORDER_STATUSES[0]
    );

    if (pendingOrders.length >= 5) {
      throw new OrderControllerError(
        "Vous avez atteint la limite de 5 commandes en attente."
      );
    }

    currentOrders.push(order);
    this.setOrders(currentOrders);
    console.log("Order saved to localStorage:", order);
    this.fakeProgressOrder(order.id);
  }

  async fakeProgressOrder(orderId) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    console.log("Processing order:", orderId, orders);
    if (!order) {
      throw new Error("Order not found");
    }
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Fake order processed");
        const nextStatus =
          ORDER_STATUSES[ORDER_STATUSES.indexOf(order.status) + 1];
        console.log(`Order status updated to: ${nextStatus}`);
        if (nextStatus) {
          order.status = nextStatus;
        }

        this.setOrders(orders);
        this.view.displayPaidOrders(); // Refresh the paid orders display
        if (nextStatus !== ORDER_STATUSES[ORDER_STATUSES.length - 1]) {
          this.fakeProgressOrder(orderId); // Recursively call to simulate ongoing processing
        }

        resolve();
      }, 10000); // Simulate a delay for the fake order processing
    });
  }
}
export { OrderController, OrderControllerError };
