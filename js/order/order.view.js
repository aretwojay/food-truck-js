import { ORDER_STATUSES } from "../constants.js";
import { OrderControllerError } from "./order.controller.js";
import { OrderModel } from "./order.model.js";

const orderItemTemplate = (item) => `
<div class="order-item flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
    <img class="size-[100px] object-cover" src="/public/menu/${
      item.image
    }" alt="${item.name}" class="order-item-image">
  <h3 class="order-item-title">${item.name}</h3>
  <p class="order-item-price">${item.price.toFixed(2)} €</p>
  <p class="order-item-quantity">Quantité: ${item.quantity}</p>
</div>
`;

const paidOrderTemplate = (order) => `
<div class="paid-order">
    <h3 class="paid-order-title">Commande #${order.id}</h3>
    <p class="paid-order-date">Date: ${new Date(order.id).toLocaleString()}</p>
    <p class="paid-order-status">Statut: ${order.status}</p>
        ${
          order.status === ORDER_STATUSES[0]
            ? `
        <button class="cancel-order bg-red-500 hover:bg-red-500/70 cursor-pointer text-white p-2 my-4 rounded-lg" data-id="${order.id}">Cancel order</button>    
    `
            : ""
        }
    <div class="paid-order-items overflow-y-auto h-64 bg-gray-100 p-4 rounded-lg flex flex-col gap-4">
            ${order.cart.items.map(orderItemTemplate).join("")}
    </div>
    <div class="paid-order-total mt-4">
        <p class="paid-order-subtotal">Sous-total (HT): ${order.cart
          .getTotalPrice()
          .toFixed(2)} €</p>
        <p class="paid-order-total-ttc">Total (TTC): ${order.cart
          .getTotalPriceTTC()
          .toFixed(2)} €</p>
    </div>
`;

class OrderView {
  constructor({ cartController, orderController }) {
    this.orderBtn = document.getElementById("order-button");
    this.orderItems = document.getElementById("order-items");
    this.orderModal = document.getElementById("order-modal");
    this.paidOrderItems = document.getElementById("paid-order-items");
    this.orderSubtotalHT = document.getElementById("order-subtotal-ht");
    this.orderTotalTTC = document.getElementById("order-total-ttc");
    this.orderCancelBtn = document.getElementById("cancel-order");
    this.closeModalBtn = document.getElementById("close-modal");
    this.validateOrderBtn = document.getElementById("validate-order");
    this.cartController = cartController;
    this.orderController = orderController;
  }

  init() {
    if (!this.orderBtn) {
      throw new Error("Order button not found in the DOM.");
    }

    this.displayPaidOrders();

    this.orderBtn.addEventListener("click", () => {
      console.log("Order button clicked");
      this.orderModal.classList.toggle("hidden");
      this.renderOrderItems(this.cartController.getItems());
      // Here you would typically handle the order submission logic
      // For example, you might call a method to submit the order
    });

    for (const item of [this.closeModalBtn, this.orderCancelBtn]) {
      if (!item) {
        throw new Error(
          "Close modal button or cancel order button not found in the DOM."
        );
      }
      item.addEventListener("click", () => {
        console.log("Close modal or cancel order button clicked");
        this.orderModal.classList.add("hidden");
      });
    }

    this.paidOrderItems.addEventListener("click", (event) => {
      if (event.target.classList.contains("cancel-order")) {
        const orderId = +event.target.getAttribute("data-id");
        console.log(`Canceling order with ID: ${orderId}`);
        this.orderController.cancelOrder(orderId);
        this.displayPaidOrders(); // Refresh the paid orders display
        alert(`La commande ${orderId} a bien été annulée.`);
      }
    });

    this.validateOrderBtn.addEventListener("click", async () => {
      console.log("Validate order button clicked");
      const items = this.cartController.getItems();
      if (items.length === 0) {
        alert(
          "Votre panier est vide. Ajoutez des articles avant de valider la commande."
        );
        return;
      }
      this.validateOrderBtn.disabled = true; // Disable button to prevent multiple clicks
      this.validateOrderBtn.textContent = "Processing...";

      try {
        await this.orderController.fakePostCommande();
        // Here you would typically handle the order submission logic
        // For example, you might call a method to submit the order
        this.orderModal.classList.add("hidden");
        this.cartController.clearCart();
        this.displayPaidOrders(); // Refresh the paid orders display
        alert("Commande validée avec succès !");
      } catch (err) {
        console.error("Error placing order:", err);
        if (err instanceof OrderControllerError) {
          alert(err.message);
          return;
        }
        alert(
          "Une erreur s'est produite lors de la validation de la commande. Veuillez réessayer plus tard."
        );
      } finally {
        this.validateOrderBtn.disabled = false; // Re-enable button after processing
        this.validateOrderBtn.textContent = "Valider";
      }
    });
  }

  renderOrderItems(items) {
    if (!this.orderItems) {
      throw new Error("Order items element not found in the DOM.");
    }

    this.orderItems.innerHTML = "";
    if (items.length === 0) {
      this.orderItems.innerHTML = "<p>Aucune commande passée.</p>";
      return;
    }

    items.forEach((item) => {
      this.orderItems.innerHTML += orderItemTemplate(item);
    });
    this.orderSubtotalHT.textContent = `${this.cartController
      .getTotalPrice()
      .toFixed(2)} €`;
    this.orderTotalTTC.textContent = `${this.cartController
      .getTotalPriceTTC()
      .toFixed(2)} €`; // Assuming a 20% tax rate
  }

  displayPaidOrders() {
    const orders = this.orderController.getOrders();
    if (!this.paidOrderItems) {
      throw new Error("Paid order items element not found in the DOM.");
    }
    this.paidOrderItems.innerHTML = "";
    if (orders.length === 0) {
      this.paidOrderItems.innerHTML = "<p>Aucune commande payée.</p>";
      return;
    }
    orders.forEach((order) => {
      const orderModel = new OrderModel({
        items: order.cart.items,
        id: order.id,
        status: order.status,
      });
      this.paidOrderItems.innerHTML += paidOrderTemplate(orderModel);
    });
  }
}

export { OrderView };
