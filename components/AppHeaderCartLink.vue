<script setup lang="ts">
const route = useRoute();
const selected = ref(false);

const { cart } = storeToRefs(useItemsStore());

const cartItemsCount = computed(() => {
  return cart.value.reduce((count, item) => count + (item.amount ?? 0), 0);
});

const routeName = computed(() => route.name);

watch(routeName, () => {
  if (routeName.value === "cart") {
    selected.value = true;
  } else {
    selected.value = false;
  }
});

const emit = defineEmits(["buttonClick"]);
</script>

<template>
  <div>
    <button
      @click="
        () => {
          emit('buttonClick');
          navigateTo('/cart');
        }
      "
      :class="`link ${selected ? 'active' : ''}`"
    >
      <img src="/img/cart.svg" alt="Cart icon" />
      <div v-if="cartItemsCount > 0" class="cart-badge">
        {{ cartItemsCount }}
      </div>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.active {
  filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.4));
}

img:hover {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
}

button {
  position: relative;
}

.cart-badge {
  position: absolute;
  bottom: -13px;
  right: -11px;
  background: $fill4-clr;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  @include small-bold($mobile: false);
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  .cart {
    width: 50px;
    height: 50px;
  }
}
</style>
