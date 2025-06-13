const cartViewEmpty = `<div id="empty-cart" class="text-center text-gray-500 mt-8">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-16 h-16 mx-auto mb-4 text-gray-300"
    >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path
        d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
        />
    </svg>
    <p>Votre panier est vide</p>
</div>
`;

const cardItemTemplate = (item) => `
<div class="cart-item" data-id="${item.id}">
    <img class="w-[200px] object-cover" src="/public/menu/${item.image}" alt="${
  item.name
}" class="cart-item-image" />
  <span>${item.name}</span>
  <span>${item.price.toFixed(2)} €</span>
  <div class="flex items-center gap-2">
    <span>Quantité: </span>
    <input type="number" min="0" value="${
      item.quantity || 1
    }" class="quantity-input rounded-lg p-2 border" data-id="${item.id}" />
  </div>
  <button class="remove-item bg-red-500 hover:bg-red-500/70 cursor-pointer text-white p-2 my-4 rounded-lg" data-id="${
    item.id
  }">Supprimer</button>
</div>
`;

class CartView {
  constructor(cart) {
    this.cart = cart;
    this.cartItemsElement = document.getElementById("cart-items");
    this.totalElement = document.getElementById("cart-total");
    this.cartButton = document.getElementById("cart-button");
    this.cartFooter = document.getElementById("cart-footer");
    this.closeCart = document.getElementById("close-cart");
    this.cartCount = document.getElementById("cart-count");
  }

  init() {
    if (!this.cartItemsElement || !this.totalElement) {
      throw new Error("Cart elements not found in the DOM.");
    }

    this.cartItemsElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        const itemId = +event.target.getAttribute("data-id");
        console.log(`Removing item with ID: ${itemId}`);
        this.cart.removeItem(itemId);

        this.render();
      }
    });

    this.render();
    this.attachEventListeners();
  }

  render() {
    this.cartItemsElement.innerHTML = "";
    this.cartCount.textContent = this.cart.getTotalItems();
    this.cart
      .getItems()
      .forEach(
        (item) => (this.cartItemsElement.innerHTML += cardItemTemplate(item))
      );
    if (this.cart.getItems().length === 0) {
      this.cartItemsElement.innerHTML = cartViewEmpty;
      this.cartFooter.classList.add("hidden");
    } else {
      this.cartFooter.classList.remove("hidden");
    }

    // Attach event listeners to quantity inputs
    const cartQuantityElements = document.querySelectorAll(".quantity-input");
    cartQuantityElements.forEach((input) => {
      input.addEventListener("change", (event) => {
        const itemId = +event.target.getAttribute("data-id");
        const newQuantity = +event.target.value;
        console.log(
          `Updating item with ID: ${itemId} to quantity: ${newQuantity}`
        );
        this.cart.setItemQuantity(itemId, newQuantity);
        this.render();
      });
    });
    this.totalElement.textContent = `Total: ${this.cart
      .getTotalPrice()
      .toFixed(2)} €`;
  }

  displayCartSidebar(show) {
    const cartSidebar = document.getElementById("cart-sidebar");
    if (show === true) {
      cartSidebar.classList.remove("translate-x-full");
    } else if (cartSidebar) {
      cartSidebar.classList.toggle("translate-x-full");
    } else {
      console.warn("Cart sidebar not found in the DOM.");
    }
  }

  attachEventListeners() {
    for (const element of [this.cartButton, this.closeCart]) {
      if (element) {
        element.addEventListener("click", this.displayCartSidebar);
      } else {
        console.warn(`${element.id} not found in the DOM.`);
      }
    }
  }
}

export { CartView };
