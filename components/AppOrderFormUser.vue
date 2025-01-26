<script setup lang="ts">
import type { Address } from "@/types/types";

const props = defineProps<{
  isLoading: boolean;
  successMessage: string;
}>();

const inputsDisabled = computed(() => (props.successMessage ? true : false));

const { user: userInfo } = storeToRefs(useUserStore());

const emit = defineEmits(["submit"]);

const getMainAddressIndex = (addresses: Array<Address>) => {
  return addresses.findIndex((addr) => addr.main);
};

const mainAddressIndex = computed(
  () => getMainAddressIndex(userInfo.value!.addresses!) ?? 0
);

function handleSubmit() {
  emit("submit", {
    name: userInfo.value?.name,
    phone: userInfo.value?.phone,
    address: userInfo.value!.addresses![mainAddressIndex.value]?.place,
    payMethod: userInfo.value?.payMethod || "card-online",
  });
}
</script>

<template>
  <section class="order-form" v-if="userInfo">
    <form @submit.prevent="handleSubmit" class="main-data">
      <div class="customer-information">
        <h2>Данные получателя</h2>
        <div class="customer-container">
          <div class="customer-line">
            <p class="field-name">Имя</p>
            <p class="value-text">{{ userInfo.name }}</p>
          </div>

          <div class="customer-line">
            <p class="field-name">Номер телефона</p>
            <p class="value-text">{{ userInfo.phone }}</p>
          </div>

          <div class="customer-line">
            <p class="field-name">Адрес</p>
            <p class="value-text">
              {{
                userInfo.addresses![mainAddressIndex]?.place ??
                "Адрес не указан"
              }}
            </p>
          </div>
        </div>
        <component
          :is="inputsDisabled ? 'span' : 'router-link'"
          to="/edituser"
          class="edit-link"
        >
          Изменить данные
        </component>
      </div>

      <div class="pay-information">
        <h2>Способ оплаты</h2>
        <div class="pay-radio">
          <input
            type="radio"
            class="pay-button"
            id="payChoice1"
            name="pay"
            value="card-online"
            v-model="userInfo.payMethod"
            :disabled="inputsDisabled"
          />
          <label class="pay-label" for="payChoice1">Картой онлайн</label>
        </div>
        <div class="pay-radio">
          <input
            type="radio"
            class="pay-button"
            id="payChoice2"
            name="pay"
            value="card-on-delivery"
            v-model="userInfo.payMethod"
            :disabled="inputsDisabled"
          />
          <label class="pay-label" for="payChoice2">Картой при получении</label>
        </div>
        <div class="pay-radio">
          <input
            type="radio"
            class="pay-button"
            id="payChoice3"
            name="pay"
            value="cash"
            v-model="userInfo.payMethod"
            :disabled="inputsDisabled"
          />
          <label class="pay-label" for="payChoice3"
            >Наличными при получении</label
          >
        </div>
      </div>

      <button v-if="!successMessage" class="order-button" type="submit">
        <p v-if="!isLoading">Оформить заказ</p>
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="primary"
          :size="30"
        ></v-progress-circular>
      </button>
      <div v-else class="success-message"><p>Заказ создан!</p></div>
    </form>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.order-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
}

.main-data {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 45px;
  flex: 1 0 0;
  align-self: stretch;
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

.success-message {
  display: flex;
  padding: 20px 25px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 10px;
  background: rgb(161, 255, 202);
  box-shadow: 0px 5px 9px -1px rgba(0, 0, 0, 0.25);

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
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
}

.customer-line {
  .field-name {
    width: 100px;
    min-width: 100px;
    color: $outline-clr;
    /* medium */
    @include medium-bold($mobile: false);
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
  /* medium */
  @include medium-bold($mobile: false);

  &:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
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
</style>
