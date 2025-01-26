import type { UserData } from "~/types/types";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<UserData | null>({
      id: "",
      name: "",
      phone: "",
      email: "",
      addresses: [],
      payMethod: "card-online",
    });
    const isLoggedIn = computed(() => {
      return Boolean(user.value && user.value.id);
    });

    return {
      user,
      isLoggedIn,
    };
  }
  // { persist: { storage: piniaPluginPersistedstate.localStorage() } }
);
