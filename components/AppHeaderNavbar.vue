<script setup lang="ts">
const { width: outerWidth } = useWindowSize();

const hamburgerClicked = ref(false);

const { user } = useUserStore();

const pages = computed(() => {
  if (user && user.name) {
    return [
      [
        { name: "Меню", link: "menu" },
        { name: "О нас", link: "about" },
        { name: "Контакты", link: "contacts" },
        { name: "Профиль", link: "edituser" },
      ],
    ];
  }
  return [
    [
      { name: "Меню", link: "menu" },
      { name: "О нас", link: "about" },
      { name: "Контакты", link: "contacts" },
      { name: "Войти", link: "login" },
    ],
  ];
});
</script>

<template>
  <section v-if="outerWidth >= 1134" class="">
    <div class="links">
      <AppHeaderNavbarItem
        v-for="pageDetails in pages[0]"
        :key="pageDetails.name"
        :page="pageDetails"
      />
    </div>
    <AppHeaderCartLink />
  </section>
  <section class="" v-else>
    <Transition name="fly">
      <div v-if="hamburgerClicked" class="overlay-container">
        <div class="overlay-menu">
          <button
            class="hamburger"
            @click="
              () => {
                hamburgerClicked = false;
              }
            "
          >
            <img src="/img/hamburger.svg" alt="Menu icon" />
          </button>
          <div class="links">
            <AppHeaderNavbarItem
              v-for="pageDetails in pages[0]"
              :key="pageDetails.name"
              :page="pageDetails"
              @buttonClick="hamburgerClicked = false"
            />
            <AppHeaderCartLink @buttonClick="hamburgerClicked = false" />
          </div>
        </div>
      </div>
      <button
        v-else
        class="hamburger"
        @click="
          () => {
            hamburgerClicked = true;
          }
        "
      >
        <img src="/img/hamburger.svg" alt="Menu icon" />
      </button>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

img:hover {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
}

img {
  transition-property: filter;
  transition-duration: 0.35s;
}

.links {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  cursor: pointer;
}

section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 32px;
}

.fly-enter-active {
  transition: all 0.5s ease-out;
}

.fly-leave-active {
  transition: all 0.5s ease-out;
}

.fly-enter-from,
.fly-leave-to {
  transform: translateX(80px);
  opacity: 0;
}

@media screen and (max-width: $break-tablet) {
  .hamburger {
    width: 57.6px;
    height: 38.4px;
    display: flex;
  }

  .overlay-container {
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 2;

    display: flex;
    padding: 100px 80px;
    justify-content: flex-end;
    align-items: center;
    align-content: flex-start;
    gap: 10px;
    flex-wrap: wrap;
    background: #ffe7ce;

    width: 50vw;
    height: 100vh;

    filter: drop-shadow(4px 0px 4px rgba(0, 0, 0, 0.25));
  }

  .overlay-menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 100px;
    flex: 1 0 0;
  }

  .links {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 30px;
  }
}

@media screen and (max-width: $break-mobile) {
  .hamburger {
    width: 40px;
    height: 30px;
    display: flex;
  }

  .overlay-container {
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 2;

    display: flex;
    padding: 45px 20px;
    justify-content: flex-end;
    align-items: center;
    align-content: flex-start;
    gap: 10px;
    flex-wrap: wrap;
    background: #ffe7ce;

    width: 50vw;
    height: 100vh;

    filter: drop-shadow(4px 0px 4px rgba(0, 0, 0, 1));
  }
}
</style>
