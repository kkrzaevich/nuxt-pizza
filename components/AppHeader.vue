<script setup lang="ts">
const { user, isLoggedIn } = useUserStore();
</script>

<template>
  <div class="header">
    <Transition name="fade">
      <div v-if="isLoggedIn" class="greeting">
        Добро пожаловать, <span>{{ user?.name }}</span>
      </div>
    </Transition>
    <AppHeaderLogo />
    <AppHeaderNavbar />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.header {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
  align-self: stretch;
  flex-wrap: wrap;
  width: 100%;
  position: relative;
}

.greeting {
  position: absolute;
  @include small-light($mobile: false);
  color: $outline-clr;
  top: -3rem;
  right: 5px;

  span {
    @include small($mobile: false);
  }
}

@media screen and (max-width: $break-tablet) {
  .greeting {
    display: none;
  }
}

@media screen and (max-width: $break-mobile) {
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
