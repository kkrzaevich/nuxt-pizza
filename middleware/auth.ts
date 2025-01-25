export default defineNuxtRouteMiddleware((to) => {
  // List of routes that require authentication
  const protectedRoutes = ["/edituser", "/orderlist"];

  const { isLoggedIn } = useUsers();

  // Only redirect if trying to access protected routes while not logged in
  if (protectedRoutes.includes(to.path) && !isLoggedIn.value) {
    return navigateTo("/login");
  }
});
