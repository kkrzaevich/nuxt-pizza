<script setup>
useSeoMeta({
  title: "Меню - Пиццерия в Экибазтузе",
  description: "Меню пиццерии в Экибазтузе.",
  ogTitle: "Меню - Пиццерия",
  ogDescription: "Меню пиццерии в Экибазтузе.",
});
</script>

<template>
  <div class="menu">
    <AppMenuChoose />
    <AppMenuMenu />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 70px;
  align-self: stretch;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  .menu {
    gap: 45px;
  }
}
</style>
