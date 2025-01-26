export default defineNuxtRouteMiddleware(async (to) => {
  // List of routes that require authentication
  const protectedRoutes = ["/edituser", "/orderlist"];

  const guestRoutes = ["/login", "/register"];

  const { isLoggedIn, user } = useUserStore();

  const { getUser } = useGetUser();

  // Only redirect if trying to access protected routes while not logged in
  if (protectedRoutes.includes(to.path) && !isLoggedIn) {
    return navigateTo("/login");
  }

  await getUser();

  if (guestRoutes.includes(to.path) && isLoggedIn) {
    return navigateTo("/menu");
  }
});
