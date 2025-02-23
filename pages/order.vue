<script setup lang="ts">
import type { Order } from "@/types/types";

const cartSum = computed(() => useItemsStore().cartSum);
const { cart } = storeToRefs(useItemsStore());
const isLoggedIn = computed(() => useUserStore().isLoggedIn);
const { user } = storeToRefs(useUserStore());
const { createOrder } = useOrderStore();
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);

const orderDialogOpen = ref(false);
const orderDialogContents = ref("");

useSeoMeta({
  title: "Оформление заказа",
  description: "Оформление заказа",
  ogTitle: "Оформление заказа",
  ogDescription: "Оформление заказа",
  ogImage: "/logo.png",
});

const handleSubmit = async (values: Order) => {
  isLoading.value = true;
  const cartContents = cart.value.map((item) => ({
    heading: item.heading,
    amount: item.amount ?? 0,
    price: item.price,
  }));
  const order: Order = {
    ...values,
    contents: cartContents,
    totalPrice: cartSum.value,
    status: "cooking",
    uuid: user.value?.id ?? "",
  };
  try {
    const success = await createOrder(order);
    if (success) {
      errorMessage.value = "";
      successMessage.value = "Заказ создан!";
      orderDialogContents.value = "Заказ создан. Время ожидания 30-60 минут.";
      orderDialogOpen.value = true;
    } else {
      orderDialogContents.value =
        "Ошибка создания заказа. Повторите попытку позже";
      orderDialogOpen.value = true;
      throw new Error("Ошибка создания заказа. Повторите попытку позже");
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Ошибка создания заказа. Повторите попытку позже";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section>
    <h1>Оформление заказа</h1>
    <div class="main-content" v-if="cart.length > 0">
      <div class="main-cost-mobile">
        <h2>Заказ</h2>
        <div v-for="item in cart" :key="item.heading" class="cost-line">
          <p>{{ `${item.amount} x ${item.heading}` }}</p>
          <p>{{ `${item.price} тг` }}</p>
        </div>
        <div class="total-line">
          <p>Итого:</p>
          <p>{{ `${cartSum} тг` }}</p>
        </div>
      </div>

      <div class="form-container">
        <AppOrderFormUser
          v-if="isLoggedIn"
          @submit="handleSubmit"
          :is-loading="isLoading"
          :success-message="successMessage"
        />
        <AppOrderFormGuest
          v-else
          @submit="handleSubmit"
          :is-loading="isLoading"
          :success-message="successMessage"
        />
        <p class="error-text" v-if="errorMessage">{{ errorMessage }}</p>
        <RouterLink
          class="edit-link"
          v-if="successMessage && isLoggedIn"
          to="/orderlist"
          >Ваши заказы</RouterLink
        >
      </div>

      <div class="main-cost-desktop">
        <h2>Заказ</h2>
        <div v-for="item in cart" :key="item.heading" class="cost-line">
          <p>{{ `${item.amount} x ${item.heading}` }}</p>
          <p>{{ `${item.price} тг` }}</p>
        </div>
        <div class="total-line">
          <p>Итого:</p>
          <p>{{ `${cartSum} тг` }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Ваша корзина пуста</p>
    </div>
    <AppOrderDialog v-model="orderDialogOpen" :contents="orderDialogContents" />
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 45px;
  align-self: stretch;
}

.error-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 7px;
}

h1 {
  color: $outline-clr;
  /* logo-main */
  @include logo-main($mobile: false);
}

h2 {
  color: $outline-clr;
  /* bigger-bold */
  @include bigger-bold($mobile: false);
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 35px;
  align-self: stretch;
  width: 100%;
}

.main-data {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 45px;
  flex: 1 0 0;
}

.main-cost-desktop {
  display: flex;
  padding: 35px;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: $fill1-clr;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.main-cost-mobile {
  display: none;
}

.customer-information {
  display: flex;
  padding: 35px;
  flex-direction: column;
  align-items: flex-start;
  gap: 35px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: $bg-clr;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.pay-information {
  display: flex;
  padding: 35px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: $bg-clr;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.order-button {
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

.order-button:hover {
  filter: drop-shadow(0px 6px 12px rgba(126, 126, 126, 0.5));
}

.order-button {
  p {
    color: $outline-clr;
    text-align: center;
    /* bigger-bold */
    font-family: Roboto;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}

.customer-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
}

.customer-line {
  display: flex;
  align-items: flex-start;
  gap: 35px;
  align-self: stretch;
}

.customer-line {
  .field-name {
    width: 100px;
    min-width: 100px;
    color: $outline-clr;
    /* medium */
    @include medium($mobile: false);
  }

  input {
    height: 25px;
    flex: 1 0 0;
    border-radius: 10px;
    border: none;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    box-sizing: content-box;

    color: $outline-clr;
    /* medium */
    @include medium($mobile: false);
    font-weight: 300;

    outline: none;
  }

  textarea {
    width: 100%;
    box-sizing: content-box;
    border: none;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;

    color: $outline-clr;
    /* medium */
    @include medium($mobile: false);
    font-weight: 300;

    outline: none;
  }
}

.pay-radio {
  display: flex;
  align-items: center;
  gap: 35px;
}

.pay-button {
  color: $outline-clr;
  /* medium */
  @include medium($mobile: false);

  appearance: none;

  border-radius: 50%;
  width: 16px;
  height: 16px;

  border: 2px solid #999;
  transition: 0.2s all linear;
  margin-right: 5px;
}

.pay-button:checked {
  border: 6px solid $outline-clr;
}

.pay-label {
  color: $outline-clr;
  /* medium */
  @include medium($mobile: false);
}

.cost-line,
.total-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  min-width: 225px;
}

.cost-line {
  p {
    color: $outline-clr;
    /* medium */
    @include medium($mobile: false);

    max-width: 150px;
  }
}

.total-line {
  p {
    color: $outline-clr;
    /* medium-bold */
    @include medium-bold($mobile: false);
  }
}

.error-text {
  color: red;
  /* medium */
  @include small($mobile: false);
}

.value-text {
  color: $outline-clr;
  /* medium */
  @include medium($mobile: false);
}

.edit-link {
  margin-top: 15px;
  color: $fill4-clr;
  text-decoration: underline;
  /* medium */
  @include medium($mobile: false);

  &:hover {
    opacity: 0.8;
  }
}

@media screen and (max-width: $break-tablet) {
  .main-cost-desktop {
    display: none;
  }

  .main-cost-mobile {
    display: flex;
    padding: 35px;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    align-self: stretch;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: $fill1-clr;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 45px;
    align-self: stretch;
  }

  .cost-line {
    p {
      max-width: unset;
    }
  }
}

@media screen and (max-width: $break-mobile) {
  h1 {
    color: $outline-clr;
    /* bigger-bold */
    @include bigger-bold($mobile: false);
  }

  h2 {
    @include bigger-bold($mobile: true);
  }

  * {
    min-width: none;
  }
}

.form-container {
  flex: 1;
  width: 100%;
  min-width: 0;
}
</style>
