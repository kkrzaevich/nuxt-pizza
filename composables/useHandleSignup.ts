import type { userCredentials } from "~/types/types";

export const useHandleSignup = () => {
  const { user } = storeToRefs(useUserStore());
  const { makeAddressMain } = useEditAddresses();
  const loading = ref(false);
  const supabase = useSupabaseClient();

  const handleSignup = async (credentials: userCredentials) => {
    const { email, password, username, phone, address } = credentials;

    try {
      if (password.length < 6) {
        throw new Error("Пароль должен быть длиннее 6 символов.");
      }

      if (username.length < 3) {
        throw new Error("Имя пользователя должно быть длиннее 3 символов.");
      }

      if (!validateEmail(email)) {
        throw new Error("Email недействителен.");
      }

      loading.value = true;

      const { data: userWithUsername } = await supabase
        .from("usernames")
        .select()
        .eq("username", username);

      if (userWithUsername && userWithUsername.length > 0) {
        throw new Error("Пользователь с таким именем уже существует.");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.code === "invalid_credentials") {
          throw new Error("Неверный email или пароль.");
        }
        if (authError.code === "user-not-found") {
          throw new Error("Пользователь не найден.");
        }
        if (authError.code === "email_exists") {
          throw new Error("Пользователь с таким email уже существует.");
        }
        throw new Error("Ошибка авторизации. Повторите попытку позже.");
      }

      const dbUser = await supabase.auth.getUser();
      const userData = dbUser.data.user;
      const userId = userData?.id;
      const userEmail = userData?.email;

      if (!userId || !userEmail) {
        throw new Error("Ошибка получения данных пользователя.");
      }

      const { error: usernameError } = await supabase.from("usernames").insert({
        username: username,
        uuid: userId,
      });

      if (usernameError) {
        throw new Error("Ошибка имени пользователя. Повторите попытку позже.");
      }

      const { error: userdataError } = await supabase.from("userdata").insert({
        uuid: userId,
        phone: phone,
        paymethod: "card-online",
      });

      if (userdataError) {
        throw new Error("Ошибка данных пользователя. Повторите попытку позже.");
      }

      const { error: addressError } = await supabase.from("addresses").insert({
        uuid: userId,
        address: address,
        main: true,
      });

      if (addressError) {
        throw new Error("Ошибка адреса. Повторите попытку позже.");
      }

      const { data: newUser, error: newUserError } = await supabase
        .from("userdata")
        .select()
        .eq("uuid", userId)
        .single();

      if (newUserError) {
        throw new Error("Ошибка данных пользователя. Повторите попытку позже.");
      }

      user.value = {
        id: userId,
        email: userEmail,
        phone: phone,
      };

      const { data: newUsername, error: newUsernameError } = await supabase
        .from("usernames")
        .select()
        .eq("uuid", userId)
        .single();

      if (newUsernameError) {
        throw new Error("Ошибка имени пользователя. Повторите попытку позже.");
      }

      user.value.name = newUsername.username ?? undefined;

      const { data: addressesData, error: addressesError } = await supabase
        .from("addresses")
        .select()
        .eq("uuid", userId);

      if (addressesError) {
        throw new Error("Ошибка адреса. Повторите попытку позже.");
      }

      const addresses = extractAddressesData(addressesData);

      user.value.addresses = addresses;

      return true;
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  return {
    handleSignup,
    loading,
  };
};
