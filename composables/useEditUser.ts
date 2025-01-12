import type { PayMethod } from "~/types/types";

export const useEditUser = () => {
  const loading = ref(false);
  const supabase = useSupabaseClient();
  const { user } = useUsers();

  const editUserName = async (name: string) => {
    try {
      loading.value = true;

      if (!user.value?.id) {
        throw new Error("Пользователь не найден.");
      }

      const { error: nameError } = await supabase
        .from("usernames")
        .update({ username: name })
        .eq("uuid", user.value.id);

      if (nameError) {
        throw new Error("Ошибка обновления данных. Повторите попытку позже");
      }

      // Verify name update
      const { data: nameData, error: nameVerifyError } = await supabase
        .from("usernames")
        .select("username")
        .eq("uuid", user.value.id)
        .single();

      if (nameVerifyError)
        throw new Error("Ошибка верификации данных. Повторите попытку позже");
      if (nameData.username !== name)
        throw new Error("Ошибка верификации данных. Повторите попытку позже");

      user.value.name = nameData.username;
      return true;
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  const editUserPhone = async (phone: string) => {
    try {
      loading.value = true;

      if (!user.value?.id) {
        throw new Error("Пользователь не найден.");
      }

      const { error: phoneError } = await supabase
        .from("userdata")
        .update({ phone })
        .eq("uuid", user.value.id);

      if (phoneError)
        throw new Error("Ошибка обновления данных. Повторите попытку позже");

      // Verify phone update
      const { data: phoneData, error: phoneVerifyError } = await supabase
        .from("userdata")
        .select("phone")
        .eq("uuid", user.value.id)
        .single();

      if (phoneVerifyError)
        throw new Error("Ошибка верификации данных. Повторите попытку позже");
      if (phoneData.phone !== phone)
        throw new Error("Ошибка верификации данных. Повторите попытку позже");

      user.value.phone = phoneData.phone;
      return true;
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  const editUserPayMethod = async (payMethod: string) => {
    try {
      loading.value = true;

      if (!user.value?.id) {
        throw new Error("Пользователь не найден.");
      }

      const { error: payMethodError } = await supabase
        .from("userdata")
        .update({ paymethod: payMethod })
        .eq("uuid", user.value.id);

      if (payMethodError)
        throw new Error("Ошибка обновления данных. Повторите попытку позже");

      // Verify payMethod update
      const { data: payMethodData, error: payMethodVerifyError } =
        await supabase
          .from("userdata")
          .select("paymethod")
          .eq("uuid", user.value.id)
          .single();

      if (payMethodVerifyError)
        throw new Error("Ошибка верификации данных. Повторите попытку позже");
      if (payMethodData.paymethod !== payMethod)
        throw new Error("Ошибка верификации данных. Повторите попытку позже");

      user.value.payMethod = payMethodData.paymethod as PayMethod;
      return true;
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  const editUserEmail = async (email: string) => {
    try {
      loading.value = true;

      const { data: newUserData, error: emailErrorAuth } =
        await supabase.auth.updateUser({
          email,
        });

      if (emailErrorAuth)
        throw new Error("Ошибка обновления email. Повторите попытку позже");
      if (newUserData.user.email_change_sent_at) {
        return true;
      }
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    editUserName,
    editUserPhone,
    editUserPayMethod,
    editUserEmail,
  };
};
