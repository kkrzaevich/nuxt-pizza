import type { Order } from "~/types/types";

export const useOrders = () => {
  const orders = useState("orders", () => {
    const orders: Order[] = [];
    return orders;
  });

  const loadingOrders = useState("loadingOrders", () => false);

  const supabase = useSupabaseClient();

  const { cart } = useItems();

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
};

// const moduleOrders = {
//   state() {
//     return {
//       orders: [],
//     };
//   },
//   mutations: {
//     setOrders(state: any, payload: Order[]) {
//       state.orders = payload;
//     },
//   },
//   actions: {
//     async fetchOrders({ commit }: any, uuid: string) {
//       const { data, error } = await supabase
//         .from("orders")
//         .select("*")
//         .eq("uuid", uuid);
//       if (error) throw new Error(error.message);
//       const orders = data.map((order: any) => ({
//         id: order.id,
//         created_at: order.created_at,
//         contents: order.contents,
//         status: order.status,
//         address: order.address,
//         totalPrice: order.totalPrice,
//       }));
//       commit("setOrders", orders);
//       return true;
//     },
//     async createOrder({ commit }: any, payload: Order) {
//       const { error } = await supabase.from("orders").insert([payload]);
//       if (error) throw new Error(error.message);
//       store.commit("emptyCart");
//       return true;
//     },
//   },
// };

// export default moduleOrders;
