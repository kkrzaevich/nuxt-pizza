export default defineNuxtRouteMiddleware(async (to) => {
  // List of routes that require authentication
  const protectedRoutes = ["/edituser", "/orderlist"];

  const guestRoutes = ["/login", "/register"];

  const { user } = useUserStore();

  const isLoggedIn = computed(() => useUserStore().isLoggedIn);

  const { getUser } = useGetUser();

  await getUser();

  console.log("isLoggedIn", isLoggedIn);

  // Only redirect if trying to access protected routes while not logged in
  if (protectedRoutes.includes(to.path) && !isLoggedIn) {
    return navigateTo("/login");
  }

  if (guestRoutes.includes(to.path) && isLoggedIn) {
    return navigateTo("/menu");
  }
});
