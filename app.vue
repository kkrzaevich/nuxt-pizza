<script setup>
import { onMounted } from "vue";

const { getUser } = useGetUser();
const { fetchItems } = useItemsStore();
onMounted(async () => {
  await getUser();
  await fetchItems();
});
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
@use "./assets/styles" as *;

.app {
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
  .app {
    padding: 5rem;
  }
}

@media screen and (max-width: 699px) {
  .app {
    padding: 2.5rem 1.25rem;
  }
}

.fly-fade-enter-active {
  transition: all 0.3s;
}

.fly-fade-leave-active {
  transition: all 0.3s;
}

.fly-fade-enter-from {
  transform: translateX(120px);
  opacity: 0;
}

.fly-fade-leave-to {
  opacity: 0;
}
</style>
