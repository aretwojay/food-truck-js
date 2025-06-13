import { ItemModel } from "./item.model.js";
import { ItemView } from "./item.view.js";

class ItemController {
  constructor(cartController) {
    this.cartController = cartController;
    this.view = new ItemView(cartController);
  }

  async getItems() {
    try {
      const response = await fetch(
        `https://keligmartin.github.io/api/menu.json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item) => new ItemModel(item));
    } catch (error) {
      console.error("Error fetching items:", error);
      return [];
    }
  }

  async getItemById(id) {
    try {
      const response = await fetch(
        `https://keligmartin.github.io/api/menu.json`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return new ItemModel(data.find((item) => item.id === id) || {});
    } catch (error) {
      console.error("Error fetching item:", error);
      return null;
    }
  }

  initView(items) {
    if (!this.view) {
      throw new Error("Item view not initialized.");
    }
    this.view.displayMenu(items);
  }
}

export { ItemController };
