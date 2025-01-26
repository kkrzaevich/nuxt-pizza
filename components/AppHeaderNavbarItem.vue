<script setup lang="ts">
import type { Page } from "@/types/types";

const emit = defineEmits(["buttonClick"]);

// const route = useRoute();
// const selected = ref(false);

// console.log("route", route);

// watch(route.params, () => {
//   selected.value = route.name === props.page.link;
// });

export interface Props {
  page: Page;
}

const props = withDefaults(defineProps<Props>(), {
  page: () => {
    return {
      name: "Меню",
      link: "menu",
    };
  },
});
</script>

<template>
  <div>
    <NuxtLink
      :to="`/${page.link}`"
      class="link"
      active-class="selected"
      @click="emit('buttonClick')"
    >
      {{ page.name }}
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.link {
  color: #000;
  /* bigger */
  @include bigger($mobile: false);
}

.selected {
  color: #000;
  font-family: Roboto;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.link {
  transition-property: text-shadow;
  transition-duration: 0.35s;
  white-space: nowrap;
}

.link:hover {
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
}
</style>
