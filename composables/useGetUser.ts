import type { PayMethod } from "~/types/types";

export const useGetUser = () => {
  const loading = ref(false);
  const supabase = useSupabaseClient();
  const { user } = storeToRefs(useUserStore());
  const { makeAddressMain } = useEditAddresses();

  const getUser = async () => {
    try {
      loading.value = true;
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        user.value = null;
        return;
      }

      const email = authData.user.email;
      const uuid = authData.user.id;

      console.log("email", email);

      if (authData.user) {
        const { data: existingUser, error: existingUserError } = await supabase
          .from("userdata")
          .select()
          .eq("uuid", uuid)
          .single();

        if (existingUserError) {
          throw new Error("Пользователь не найден.");
        }

        const { data: existingUsername, error: existingUsernameError } =
          await supabase.from("usernames").select().eq("uuid", uuid).single();

        if (existingUsernameError) {
          throw new Error("Имя пользователя не найдено.");
        }

        const { data: addressesData, error: addressesError } = await supabase
          .from("addresses")
          .select()
          .eq("uuid", uuid);

        if (addressesError) {
          throw new Error("Адреса не найдены.");
        }

        // Handle main address logic
        const mainAddresses = addressesData.filter((addr) => addr.main);

        if (mainAddresses.length > 1) {
          // Keep only the first main address
          await makeAddressMain(uuid, mainAddresses[0].id);
          addressesData.forEach((addr) => {
            addr.main = addr.id === mainAddresses[0].id;
          });
        } else if (mainAddresses.length === 0 && addressesData.length > 0) {
          // No main address exists, set first address as main
          await makeAddressMain(uuid, addressesData[0].id);
          addressesData[0].main = true;
        }

        const addresses = extractAddressesData(addressesData);

        if (
          !addresses ||
          !existingUsername.username ||
          !existingUser.phone ||
          !email ||
          !existingUser.paymethod
        ) {
          throw new Error("Не найдены данные пользователя.");
        }

        user.value = {
          id: uuid,
          name: existingUsername.username,
          email: email,
          phone: existingUser.phone,
          payMethod: existingUser.paymethod as PayMethod,
          addresses: addresses,
        };

        return user.value;
      }
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  return {
    getUser,
    loading,
  };
};
