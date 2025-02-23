<script setup lang="ts">
const { handleLogout } = useHandleLogout();

// Lazy load components
const AppEditUserInfo = defineAsyncComponent(
  () => import("@/components/AppEditUserInfo.vue")
);
const AppEditUserEmail = defineAsyncComponent(
  () => import("@/components/AppEditUserEmail.vue")
);
const AppEditUserAddresses = defineAsyncComponent(
  () => import("@/components/AppEditUserAddresses.vue")
);

const logout = async () => {
  const success = await handleLogout();
  if (success) {
    await navigateTo("/login");
  }
};

useSeoMeta({
  title: "Личный кабинет - Пиццерия в Экибазтузе",
  description:
    "Управление личным кабинетом, редактирование профиля и просмотр заказов.",
  ogTitle: "Личный кабинет - Пиццерия",
  ogDescription: "Управление профилем и заказами в пиццерии.",
  robots: "noindex, nofollow", // Protect private user data from search engines
});

definePageMeta({
  layout: "default",
  middleware: "auth",
});
</script>

<template>
  <section>
    <div class="header">
      <h1>Данные пользователя</h1>
      <button class="link-button" @click="logout">
        <h2>Выйти из аккаунта</h2>
      </button>
    </div>
    <Suspense>
      <template #default>
        <div class="main-content">
          <div class="main-data">
            <AppEditUserInfo />
            <AppEditUserEmail />
            <AppEditUserAddresses />
          </div>
          <div class="router-link">
            <router-link class="link-button" to="/orderlist"
              ><h1>Мои заказы</h1></router-link
            >
          </div>
        </div>
      </template>
      <template #fallback>
        <div class="skeleton-loader">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="30"
          ></v-progress-circular>
        </div>
      </template>
    </Suspense>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 45px;
  align-self: stretch;
}

h1 {
  color: $outline-clr;
  @include logo-main($mobile: false);
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 35px;
  align-self: stretch;
  flex-direction: column;
  width: 100%;
}

.main-data {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 25px;
  flex: 1 0 0;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.link-button {
  h2 {
    @include medium-bold($mobile: false);
  }

  h1 {
    @include bigger-bold($mobile: false);
  }
}

.link-button:hover {
  filter: drop-shadow(0px 6px 12px rgba(126, 126, 126, 0.5));
}
</style>
