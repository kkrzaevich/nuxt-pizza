import type { PayMethod } from "~/types/types";

export const useHandleLogin = () => {
  const loading = ref(false);
  const supabase = useSupabaseClient();
  const { user } = useUsers();
  const { makeAddressMain } = useEditAddresses();

  const handleLogin = async (userCred: { email: string; password: string }) => {
    try {
      if (!validateEmail(userCred.email)) {
        throw new Error("Email недействителен.");
      }
      if (!userCred.password.length) {
        throw new Error("Пароль не может быть пустым.");
      }

      loading.value = true;

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: userCred.email,
        password: userCred.password,
      });

      if (error) {
        if (error.code === "invalid_credentials") {
          throw new Error("Неверный email или пароль.");
        }
        if (error.code === "user-not-found") {
          throw new Error("Пользователь не найден.");
        }
        if (error.code === "email_exists") {
          throw new Error("Пользователь с таким email уже существует.");
        }
        throw new Error("Ошибка авторизации. Повторите попытку позже.");
      }

      const email = authData.user.email;
      const uuid = authData.user.id;

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
          .select("*")
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
          !existingUser.phone ||
          !existingUser.paymethod ||
          !existingUser.id ||
          !existingUsername.username ||
          !email
        ) {
          throw new Error("Ошибка получения данных пользователя.");
        }

        user.value = {
          id: uuid,
          name: existingUsername.username,
          email: email,
          phone: existingUser.phone,
          payMethod: (existingUser.paymethod as PayMethod) ?? "card-online",
          addresses: addresses,
        };

        return true;
      }
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  return { loading, handleLogin };
};
