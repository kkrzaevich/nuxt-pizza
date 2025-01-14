<script setup>
import { onBeforeMount } from "vue";
import AppPageContent from "./components/AppPageContent.vue";
import { onMounted } from "vue";

const { getUser } = useGetUser();
const { fetchItems } = useItems();

onMounted(async () => {
  await getUser();
  await fetchItems();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped lang="scss">
@use "./assets/styles" as *;

div {
  display: grid;
  grid-auto-flow: column;
  grid-area: header;
  padding: 5rem 7.5rem;
  align-items: flex-start;
  gap: 0.625rem;
  width: 100%;
  height: fit-content;
  background: $bg-clr;
  position: relative;
}

@media screen and (max-width: 1119px) {
  div {
    padding: 5rem;
  }
}

@media screen and (max-width: 699px) {
  div {
    padding: 2.5rem 1.25rem;
  }
}
</style>
