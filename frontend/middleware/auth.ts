export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, loadToken, token } = useAuth();
  loadToken();
  if (!token.value && !isLoggedIn.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
