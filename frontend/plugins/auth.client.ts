export default defineNuxtPlugin(async () => {
  const { loadToken, fetchMe } = useAuth();
  loadToken();
  await fetchMe();
});
