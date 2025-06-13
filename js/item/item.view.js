const itemCardTemplate = (item) => `
<div class="menu-item" data-id="${item.id}">
  <img class="size-[200px] object-cover" src="/public/menu/${
    item.image
  }" alt="${item.name}" />
  <h3>${item.name}</h3>
  <p>${item.price.toFixed(2)} €</p>
  <button class="add-item cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ajouter</button>
</div>
`;

class ItemView {
  constructor(cartController) {
    this.menu = document.getElementById("menu-items");
    this.cartController = cartController; // Assuming CartView is defined elsewhere
    if (!this.menu) {
      throw new Error("Menu element not found in the DOM.");
    }
    this.init();
  }

  init() {
    this.menu.addEventListener("click", (event) => {
      if (event.target.classList.contains("add-item")) {
        const itemElement = event.target.closest(".menu-item");
        const itemId = +itemElement.getAttribute("data-id");
        this.cartController.addItem({
          id: itemId,
          quantity: 1, // Default quantity
        });
        this.cartController.showCartSidebar(true);
        console.log(`Item with ID ${itemId} added to cart.`);
        // Here you would typically call a method to add the item to the cart
      }
    });
  }

  displayMenu(items) {
    this.menu.innerHTML = items.map(itemCardTemplate).join("");
  }
}

export { ItemView };
