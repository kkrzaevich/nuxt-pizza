<script setup lang="ts">
import type { MenuItem } from "@/types/types";

export interface Props {
  id: string;
  sectionName: string;
  menuItems: MenuItem[];
}

const props = withDefaults(defineProps<Props>(), {
  id: "id",
  sectionName: "Пицца",
});
</script>

<template>
  <section :id="id">
    <h1>{{ sectionName }}</h1>
    <div class="menu-pizza-grid">
      <AppMenuItem
        v-for="item in menuItems"
        :key="item.heading ?? ''"
        :heading="item.heading ?? ''"
        :description="item.description ?? ''"
        :src="item.src ?? ''"
        :price="item.price ?? 0"
        :weight="item.weight ?? 0"
        :ingredients="item.ingredients ?? ''"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 70px;
  align-self: stretch;
}

h1 {
  color: #000;
  /* logo-main */
  @include logo-main($mobile: false);
}

div {
  display: flex;
  align-items: center;
  align-content: center;
  gap: 28px 48px;
  align-self: stretch;
  flex-wrap: wrap;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  section {
    gap: 45px;
  }

  h1 {
    @include small-bold($mobile: true);
  }

  div {
    gap: 45px 48px;
  }
}
</style>
