import { useLocalStorage } from "@vueuse/core";
import type { CartItem, MenuItem } from "~/types/types";

export const useItems = () => {
  const pizzaItems = useState("pizzaItems", () => {
    const pizzaItems: MenuItem[] = [];
    return pizzaItems;
  });
  const drinkItems = useState("drinkItems", () => {
    const drinkItems: MenuItem[] = [];
    return drinkItems;
  });
  const snackItems = useState("snackItems", () => {
    const snackItems: MenuItem[] = [];
    return snackItems;
  });
  const loadingItems = useState("loadingItems", () => false);
  const selectedItem = useState("selectedItem", () => {
    const selectedItem: CartItem = {
      heading: "",
      description: "",
      price: 0,
      weight: 0,
      src: "",
      amount: 0,
      ingredients: "",
    };
    return selectedItem;
  });
  const cart = useState("cart", () => {
    const cart = useLocalStorage("cart", [] as CartItem[]);
    return cart;
  });

  const cartSum = computed(() => {
    return cart.value.reduce(
      (sum, item) => sum + item.price * (item.amount ?? 0),
      0
    );
  });

  const cartItemsCount = computed(() => {
    return cart.value.reduce((count, item) => count + (item.amount ?? 0), 0);
  });

  const fetchItems = async () => {
    const supabase = useSupabaseClient();
    loadingItems.value = true;

    try {
      const { data, error } = await supabase.from("items").select("*");
      if (error) {
        throw new Error(error.message);
      }
      pizzaItems.value = [
        ...data.filter((item: any) => item.itemType === "pizza"),
      ];
      drinkItems.value = [
        ...data.filter((item: any) => item.itemType === "drink"),
      ];
      snackItems.value = [
        ...data.filter((item: any) => item.itemType === "snack"),
      ];
    } catch (error) {
      // Handle error
    } finally {
      loadingItems.value = false;
    }
  };

  const incrementItemAmountInCart = (heading: string) => {
    const index = cart.value.findIndex((el: CartItem) => {
      return el.heading === heading;
    });
    if (index < 0) throw new Error("Could not get the item");
    if (cart.value[index]?.amount && cart.value[index]?.amount >= 99)
      throw new Error("Inappropriate amount of items");
    if (cart.value[index]?.amount) cart.value[index]!.amount++;
  };

  const decrementItemAmountInCart = (heading: string) => {
    const index = cart.value.findIndex((el: CartItem) => {
      return el.heading === heading;
    });
    if (index < 0) throw new Error("Could not get the item");
    if (cart.value[index]?.amount && cart.value[index]?.amount <= 1)
      throw new Error("Inappropriate amount of items");
    if (cart.value[index]?.amount) cart.value[index]!.amount--;
  };

  const deleteItemFromCart = (heading: string) => {
    const index = cart.value.findIndex((el: CartItem) => {
      return el.heading === heading;
    });
    if (index < 0) throw new Error("Could not get the item");
    cart.value.splice(index, 1);
  };
  const incrementSelectedItemAmount = () => {
    if (selectedItem.value.amount && selectedItem.value.amount >= 99) return;
    if (selectedItem.value.amount) selectedItem.value.amount++;
  };
  const decrementSelectedItemAmount = () => {
    if (selectedItem.value.amount && selectedItem.value.amount <= 1) return;
    if (selectedItem.value.amount) selectedItem.value.amount--;
  };
  const addItemToCart = () => {
    const index = cart.value.findIndex((el: CartItem) => {
      return el.heading === selectedItem.value.heading;
    });
    if (index < 0) {
      cart.value.push(selectedItem.value);
    } else {
      if (cart.value[index]?.amount && selectedItem.value.amount)
        cart.value[index]!.amount += selectedItem.value.amount;
    }
  };

  return {
    pizzaItems,
    drinkItems,
    snackItems,
    loadingItems,
    selectedItem,
    cart,
    cartSum,
    cartItemsCount,
    fetchItems,
    incrementItemAmountInCart,
    decrementItemAmountInCart,
    deleteItemFromCart,
    incrementSelectedItemAmount,
    decrementSelectedItemAmount,
    addItemToCart,
  };
};
