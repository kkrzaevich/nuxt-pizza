import {
  type UserData,
  type userCredentials,
  type PayMethod,
  type Address,
} from "@/types/types";
import { useLocalStorage } from "@vueuse/core";

export const useUsers = () => {
  const supabase = useSupabaseClient();

  const user = useState("user", () => {
    const user = useLocalStorage("user", {
      id: "",
      name: "",
      phone: "",
      email: "",
      addresses: [],
      payMethod: "card-online",
    } as UserData | null);
    return user;
  });
  const isLoggedIn = computed(() => {
    return Boolean(user.value && user.value.id);
  });

  return {
    user,
    isLoggedIn,
  };
};
