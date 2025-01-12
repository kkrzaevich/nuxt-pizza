import type { Address } from "~/types/types";

export const useEditAddresses = () => {
  const loading = ref(false);
  const supabase = useSupabaseClient();
  const { user } = useUsers();

  const editUserAddresses = async (addresses: Address[]) => {
    try {
      loading.value = true;

      if (!user.value?.id) {
        throw new Error("Пользователь не найден.");
      }

      // Delete all existing addresses
      const { error: deleteError } = await supabase
        .from("addresses")
        .delete()
        .eq("uuid", user.value.id);

      if (deleteError) throw new Error(deleteError.message);

      // Insert new addresses
      if (addresses.length) {
        const { error: insertError } = await supabase.from("addresses").insert(
          addresses.map((addr) => ({
            uuid: user.value?.id,
            address: addr.place,
            main: addr.main,
          }))
        );

        if (insertError) throw new Error(insertError.message);
      }

      // Verify addresses update
      const { data: addressesData, error: addressesVerifyError } =
        await supabase
          .from("addresses")
          .select("address, id, main")
          .eq("uuid", user.value.id);

      if (addressesVerifyError) throw new Error(addressesVerifyError.message);

      const verifiedAddresses = addressesData.map((addr) => ({
        place: addr.address ?? "",
        id: addr.id,
        main: addr.main,
        new: false,
        deleted: false,
      }));

      // Verify that we have the same number of addresses and same content
      if (verifiedAddresses.length !== addresses.length) {
        throw new Error("Addresses update verification failed: count mismatch");
      }

      const addressesMatch = verifiedAddresses.every((addr) =>
        addresses.some((newAddr) => newAddr.place === addr.place)
      );

      if (!addressesMatch) {
        throw new Error(
          "Addresses update verification failed: content mismatch"
        );
      }

      user.value.addresses = verifiedAddresses;
      return true;
    } catch (error) {
      // handle error
    } finally {
      loading.value = false;
    }
  };

  const deleteUserAddress = async (addressId: number) => {
    try {
      loading.value = true;

      if (!user.value?.addresses || !user.value.id) {
        throw new Error("Данные пользователя не найдены.");
      }

      const addressToDelete = user.value.addresses.find(
        (addr) => addr.id === addressId
      );
      const { error: deleteError } = await supabase
        .from("addresses")
        .delete()
        .eq("uuid", user.value.id)
        .eq("id", addressId);

      if (deleteError) throw new Error(deleteError.message);

      // If deleting main address and there are other addresses, make first remaining address main
      if (addressToDelete?.main && user.value.addresses.length > 1) {
        const nextAddress = user.value.addresses.find(
          (addr) => addr.id !== addressId
        );
        if (nextAddress) {
          await makeAddressMain(user.value.id, nextAddress.id);
          user.value.addresses = user.value.addresses
            .filter((addr) => addr.id !== addressId)
            .map((addr, idx) =>
              idx === 0 ? { ...addr, main: true } : { ...addr, main: false }
            );
        }
      } else {
        user.value.addresses = user.value.addresses.filter(
          (addr) => addr.id !== addressId
        );
      }

      // Verify deletion
      const { data: addressData, error: verifyError } = await supabase
        .from("addresses")
        .select("id")
        .eq("uuid", user.value.id)
        .eq("id", addressId);

      if (verifyError) throw new Error(verifyError.message);
      if (addressData.length > 0)
        throw new Error("Address deletion verification failed");

      // Update store state
      user.value.addresses = user.value.addresses.filter(
        (addr) => addr.id !== addressId
      );
      return true;
    } catch (error) {
      throw new Error("Ошибка удаления адреса");
    } finally {
      loading.value = false;
    }
  };

  const editUserAddress = async ({
    addressId,
    newPlace,
  }: {
    addressId: number;
    newPlace: string;
  }) => {
    try {
      loading.value = true;

      if (!user.value?.addresses || !user.value.id) {
        throw new Error("Данные пользователя не найдены.");
      }

      const { error: updateError } = await supabase
        .from("addresses")
        .update({ address: newPlace })
        .eq("uuid", user.value.id)
        .eq("id", addressId);

      if (updateError) throw new Error(updateError.message);

      // Update local state
      user.value.addresses = user.value.addresses.map((addr) =>
        addr.id === addressId ? { ...addr, place: newPlace } : addr
      );

      return true;
    } catch (error) {
      console.error("Error updating address:", error);
      throw new Error("Ошибка обновления адреса. Повторите попытку позже.");
    } finally {
      loading.value = false;
    }
  };

  const addUserAddress = async (place: string) => {
    try {
      loading.value = true;

      if (!user.value?.id) {
        throw new Error("Данные пользователя не найдены.");
      }

      // Insert new address
      const { data: insertData, error: insertError } = await supabase
        .from("addresses")
        .insert([
          {
            uuid: user.value.id,
            address: place,
          },
        ])
        .select();

      if (insertError) throw new Error(insertError.message);
      if (!insertData || !insertData[0])
        throw new Error("No data returned after insert");

      // Make the new address main
      await makeAddressMain(user.value.id, insertData[0].id);

      // Verify insertion
      const { data: addressData, error: verifyError } = await supabase
        .from("addresses")
        .select("id, address")
        .eq("uuid", user.value.id)
        .eq("id", insertData[0].id)
        .single();

      if (verifyError) throw new Error(verifyError.message);
      if (addressData.address !== place)
        throw new Error("Address insertion verification failed");

      if (!user.value.addresses) {
        user.value.addresses = [];
      }

      // Update store state
      user.value.addresses.push({
        place,
        id: addressData.id,
        new: false,
        deleted: false,
      });
      return true;
    } catch (error) {
      console.error("Error adding address:", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const setMainAddress = async (addressId: number) => {
    try {
      loading.value = true;

      if (!user.value?.id) {
        throw new Error("Данные пользователя не найдены.");
      }

      await makeAddressMain(user.value.id, addressId);

      if (!user.value.addresses) {
        throw new Error("Адреса не найдены.");
      }

      // Update local state
      user.value.addresses = user.value.addresses.map((addr) => ({
        ...addr,
        main: addr.id === addressId,
      }));
      return true;
    } catch (error) {
      console.error("Error setting main address:", error);
      throw new Error("Ошибка установки основного адреса");
    } finally {
      loading.value = false;
    }
  };

  const makeAddressMain = async (uuid: string, addressId: number) => {
    // First, set all addresses for this user to main: false
    const { error: resetError } = await supabase
      .from("addresses")
      .update({ main: false })
      .eq("uuid", uuid);

    if (resetError) throw new Error("Ошибка обновления адресов");

    // Then set the selected address as main
    const { error: updateError } = await supabase
      .from("addresses")
      .update({ main: true })
      .eq("uuid", uuid)
      .eq("id", addressId);

    if (updateError) throw new Error("Ошибка установки основного адреса");
  };

  return {
    loading,
    makeAddressMain,
    editUserAddress,
    deleteUserAddress,
    addUserAddress,
    setMainAddress,
  };
};
