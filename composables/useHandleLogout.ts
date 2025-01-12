export const useHandleLogout = () => {
  const loading = ref(false);
  const supabase = useSupabaseClient();
  const { user } = useUsers();

  const handleLogout = async () => {
    try {
      loading.value = true;
      await supabase.auth.signOut();
      user.value = null;
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { loading, handleLogout };
};
