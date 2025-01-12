<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const selected = ref(false);
const isVisible = ref(false);
const { cartItemsCount } = useItems();

const routeName = computed(() => route.name);

const checkScroll = () => {
  const headerHeight = 100;
  isVisible.value = window.scrollY > headerHeight;
};

onMounted(() => {
  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Initial check
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll);
});

watch(routeName, () => {
  if (routeName.value === "cart") {
    selected.value = true;
  } else {
    selected.value = false;
  }
});
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isVisible && !selected"
      @click="navigateTo('/cart')"
      class="floating-cart"
    >
      <img src="/img/cart.svg" alt="Cart icon" />
      <span v-if="cartItemsCount > 0" class="cart-badge">{{
        cartItemsCount
      }}</span>
    </button>
  </Transition>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.floating-cart {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: $fill2-clr;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  img {
    width: 30px;
    height: 30px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  }
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: $fill4-clr;
  color: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  @include small-bold($mobile: false);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: $break-mobile) {
  .floating-cart {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 50px;
    height: 50px;

    img {
      width: 25px;
      height: 25px;
    }
  }
}
</style>
