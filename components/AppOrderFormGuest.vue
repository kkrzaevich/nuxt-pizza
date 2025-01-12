<script setup lang="ts">
import { useForm } from "vee-validate";
import { vMaska } from "maska/vue";
import * as yup from "yup";
import type { Order } from "@/types/types";
const { width: outerWidth } = useWindowSize();

const props = defineProps<{
  isLoading: boolean;
  successMessage: string;
}>();

const inputsDisabled = computed(() => (props.successMessage ? true : false));

const maxlength = ref(12);
const cols = ref(50);

if (outerWidth.value > 1150) {
  maxlength.value = 12;
  cols.value = 50;
} else {
  maxlength.value = 50;
  cols.value = 200;
}

const userDataSchema = yup.object({
  name: yup
    .string()
    .min(3, "Имя слишком короткое.")
    .required("Пожалуйста, введите имя."),
  phone: yup
    .string()
    .min(18, "Номер телефона должен быть полностью заполнен.")
    .max(18, "Номер телефона не может быть длиннее 18 символов.")
    .required("Пожалуйста, введите номер телефона."),
  address: yup
    .string()
    .min(3, "Адрес слишком короткий.")
    .required("Пожалуйста, введите адрес доставки."),
  payMethod: yup
    .string<"card-online" | "card-on-delivery" | "cash">()
    .required("Пожалуйста, выберите способ оплаты."),
});

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: userDataSchema,
  initialValues: {
    name: "",
    phone: "",
    address: "",
    payMethod: "card-online",
  },
});

const [name, nameAttrs] = defineField("name");
const [phone, phoneAttrs] = defineField("phone");
const [address, addressAttrs] = defineField("address");
const [payMethod, payMethodAttrs] = defineField("payMethod");

const emit = defineEmits(["submit"]);

const onSubmit = handleSubmit((values) => {
  emit("submit", values, "guest");
});
</script>

<template>
  <section class="order-form">
    <form @submit="onSubmit" class="main-data">
      <div class="customer-information">
        <h2>Данные получателя</h2>
        <div class="customer-container">
          <div class="customer-line">
            <p class="field-name">Имя</p>
            <div class="error-container">
              <input
                type="text"
                placeholder="Алихан"
                v-model="name"
                v-bind="nameAttrs"
                :disabled="inputsDisabled"
              />
              <p class="error-text" v-if="errors.name">
                {{ errors.name }}
              </p>
            </div>
          </div>

          <div class="customer-line">
            <p class="field-name">Номер телефона</p>
            <div class="error-container">
              <input
                type="tel"
                placeholder="+79991112233"
                v-maska="'+7 (###) ### ## ##'"
                v-model="phone"
                v-bind="phoneAttrs"
                :disabled="inputsDisabled"
              />
              <p class="error-text" v-if="errors.phone">
                {{ errors.phone }}
              </p>
            </div>
          </div>

          <div class="customer-line">
            <p class="field-name">Адрес</p>
            <div class="error-container">
              <textarea
                v-model="address"
                v-bind="addressAttrs"
                rows="2"
                :cols="cols"
                style="resize: none"
                placeholder="Экибастуз, ул. Машхур Жусупа, 45, кв. 11"
                :disabled="inputsDisabled"
              ></textarea>
              <p class="error-text" v-if="errors.address">
                {{ errors.address }}
              </p>
            </div>
          </div>
        </div>
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
            v-model="payMethod"
            v-bind="payMethodAttrs"
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
            v-model="payMethod"
            v-bind="payMethodAttrs"
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
            v-model="payMethod"
            v-bind="payMethodAttrs"
            :disabled="inputsDisabled"
          />
          <label class="pay-label" for="payChoice3"
            >Наличными при получении</label
          >
        </div>
        <p class="error-text" v-if="errors.payMethod">
          {{ errors.payMethod }}
        </p>
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
  align-items: stretch; // Changed from flex-start
  gap: 45px;
  width: 100%; // Added width
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
  align-items: stretch; // Changed from flex-start
  gap: 45px;
  width: 100%; // Added width
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
  gap: 1rem;
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

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
    padding: 0.5rem;
    color: $outline-clr;
    /* medium */
    @include medium($mobile: false);
    font-weight: 300;

    outline: none;
  }

  textarea {
    resize: none;
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
</style>
