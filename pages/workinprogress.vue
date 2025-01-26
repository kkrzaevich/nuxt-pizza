<script setup lang="ts">
useSeoMeta({
  title: "Мы работаем над этим :(",
  description: "Мы работаем над этим :(",
  ogTitle: "Мы работаем над этим :(",
  ogDescription: "Мы работаем над этим :(",
  ogImage: "/logo.png",
});
</script>

<template>
  <section>
    <h1>Мы работаем над этим :(</h1>
    <img src="../../img/workInProgress.PNG" alt="sad dog" />
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4.375rem;
  align-self: stretch;
}

h1 {
  color: #000;
  /* logo-main */
  @include logo-main($mobile: false);
}

img {
  height: 500px;
  filter: grayscale(100%);
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  section {
    gap: 2.8125rem;
  }

  h1 {
    @include logo-main($mobile: true);
  }
}
</style>
