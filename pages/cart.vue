<script setup lang="ts">
const { cartSum, cart } = useItems();
</script>

<template>
  <section>
    <h1>Корзина</h1>
    <p v-if="cart.length === 0" class="empty-text">В корзине пусто :(</p>
    <div class="cart-items" v-if="cart.length !== 0">
      <AppCartItem
        v-for="item in cart"
        :key="item.heading"
        :item="item"
        @updateItemAmount="
          (amount) => {
            item.amount = amount;
          }
        "
      />
    </div>
    <p class="sum" v-if="cart.length !== 0">{{ `Итого: ${cartSum} тг.` }}</p>
    <NuxtLink class="link-button" to="/order" v-if="cart.length !== 0"
      ><span>Перейти к оформлению заказа</span></NuxtLink
    >
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
  width: 199px;
  height: 33px;
  flex-shrink: 0;
  color: var(--900, #000);
  /* logo-main */
  @include logo-main($mobile: false);
}

.empty-text {
  align-self: stretch;
  color: var(--900, #000);
  /* medium */
  @include medium($mobile: false);
}

.cart-items {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 30px;
  align-self: stretch;
}

.sum {
  width: 199px;
  height: 33px;
  color: $outline-clr;
  /* bigger-bold */
  @include bigger-bold($mobile: false);
}

.link-button {
  display: flex;
  padding: 20px 25px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 10px;
  background: $fill2-clr;
  box-shadow: 0px 5px 9px -1px rgba(0, 0, 0, 0.25);
  transition: filter 0.5s;
}

.link-button:hover {
  filter: drop-shadow(0px 6px 12px rgba(126, 126, 126, 0.5));
}

span {
  color: $outline-clr;
  text-align: center;
  /* bigger-bold */
  @include bigger-bold($mobile: false);
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  h1 {
    @include logo-main($mobile: true);
  }

  .empty-text {
    @include medium($mobile: true);
  }

  span,
  .sum {
    @include bigger-bold($mobile: true);
  }

  section {
    gap: 45px;
  }
}
</style>
