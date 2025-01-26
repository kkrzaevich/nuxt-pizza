<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div>
    <h1>Ошибка {{ error ? error.statusCode : "404" }}</h1>
    <NuxtLink to="/">Вернуться в меню</NuxtLink>
  </div>
</template>

<style scoped lang="scss">
@use "/assets/styles" as *;
</style>
