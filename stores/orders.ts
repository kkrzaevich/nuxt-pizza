import type { Order } from "~/types/types";

export const useOrderStore = defineStore("orders", () => {
  const orders = ref<Order[]>([]);

  const loadingOrders = ref(false);

  const supabase = useSupabaseClient();

  const { cart } = storeToRefs(useItemsStore());

  const fetchOrders = async (uuid: string) => {
    loadingOrders.value = true;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("uuid", uuid);
      if (error) throw new Error(error.message);
      orders.value = data.map((order: any) => ({
        id: order.id,
        created_at: order.created_at,
        contents: order.contents,
        status: order.status,
        address: order.address,
        totalPrice: order.totalPrice,
        payMethod: order.payMethod,
        name: order.name,
        phone: order.phone,
      }));
      return true;
    } catch (error) {
      // handle error
    } finally {
      loadingOrders.value = false;
    }
  };

  const createOrder = async (payload: Order) => {
    try {
      const { error } = await supabase.from("orders").insert([payload]);
      if (error) throw new Error(error.message);
      cart.value = [];
      return true;
    } catch (error) {
      // handle error
    } finally {
      loadingOrders.value = false;
    }
  };

  return {
    orders,
    loadingOrders,
    fetchOrders,
    createOrder,
  };
});
