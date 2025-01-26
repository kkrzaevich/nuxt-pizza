<script setup lang="ts">
const { pizzaItems, drinkItems, snackItems, loadingItems } = useItemsStore();
</script>

<template>
  <div v-if="loadingItems" class="loading-container">
    <v-progress-circular
      indeterminate
      color="primary"
      :size="50"
    ></v-progress-circular>
  </div>

  <div v-else>
    <AppMenuSection
      id="pizza"
      sectionName="Пицца"
      :menuItems="pizzaItems ?? []"
    />
    <AppMenuSection
      id="drinks"
      sectionName="Напитки"
      :menuItems="drinkItems ?? []"
    />
    <AppMenuSection
      id="snacks"
      sectionName="Закуски"
      :menuItems="snackItems ?? []"
    />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 70px;
  align-self: stretch;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  div {
    gap: 45px;
  }
}
</style>
