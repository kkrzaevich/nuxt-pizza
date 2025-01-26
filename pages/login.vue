<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useForm } from "vee-validate";
import { vMaska } from "maska/vue";
import { useRouter } from "vue-router";
import * as yup from "yup";

import type { UserData } from "@/types/types";

useSeoMeta({
  title: "Вход - Пиццерия в Экибазтузе",
  description: "Вход в личный кабинет пиццерии в Экибазтузе.",
  ogTitle: "Вход в личный кабинет - Пиццерия",
  ogDescription: "Вход в личный кабинет пиццерии в Экибазтузе.",
});

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { width: outerWidth } = useWindowSize();

const maxlength = ref(12);
const cols = ref(50);

if (outerWidth.value > 1150) {
  maxlength.value = 12;
  cols.value = 50;
} else {
  maxlength.value = 50;
  cols.value = 200;
}

let userDataSchema = yup.object({
  email: yup
    .string()
    .email("Пожалуйста, введите действительный email.")
    .required("Пожалуйста, введите email."),
  password: yup
    .string()
    .min(6, "Пароль слишком короткий.")
    .required("Пожалуйста, введите пароль."),
});

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: userDataSchema,
});

const [email, emailAttrs] = defineField("email", {
  //   validateOnModelUpdate: false
});
const [password, passwordAttrs] = defineField("password", {
  //   validateOnModelUpdate: false
});

const errorMessage = ref("");

const isLoading = ref(false);

const { handleLogin } = useHandleLogin();

const onSubmit = handleSubmit.withControlled(async (values: any) => {
  const userCred: { email: string; password: string } = {
    email: values.email as string,
    password: values.password as string,
  };
  try {
    isLoading.value = true;
    const success = await handleLogin(userCred);
    if (success) {
      await navigateTo("/menu");
    } else {
      throw new Error("Ошибка входа. Повторите попытку позже");
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Ошибка входа. Повторите попытку позже";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section>
    <h1>Вход</h1>
    <div class="main-content">
      <form class="main-data" @submit="onSubmit">
        <div class="personal-data">
          <div class="personal-details">
            <h2>Email</h2>
            <input
              type="text"
              placeholder="Введите email"
              name="name"
              v-model="email"
              v-bind="emailAttrs"
            />
            <p class="error-text" v-if="errors.email">
              {{ errors.email }}
            </p>
          </div>
          <div class="personal-details">
            <h2>Пароль</h2>
            <input
              type="password"
              placeholder="Введите пароль"
              name="name"
              v-model="password"
              v-bind="passwordAttrs"
            />
            <p class="error-text" v-if="errors.password">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div class="buttons">
          <button class="order-button" type="submit">
            <p v-if="!isLoading">Войти</p>
            <v-progress-circular
              v-if="isLoading"
              indeterminate
              color="primary"
              :size="30"
            ></v-progress-circular>
          </button>
        </div>
        <p class="error-text" v-if="errorMessage">
          {{ errorMessage }}
        </p>
      </form>
    </div>
    <p class="register">
      Нет аккаунта?
      <RouterLink class="register-link" to="/register"
        ><b>Зарегистрироваться.</b></RouterLink
      >
    </p>
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

.register {
  @include medium;
}

.register-link {
  @include medium-bold;
}

.personal-data {
  display: flex;
  gap: 15px;
  flex-direction: column;

  .personal-details {
    display: flex;
    padding: 15px 20px;
    gap: 10px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

    h2 {
      @include medium-bold($mobile: false);
    }

    input {
      @include medium($mobile: false);
      border: none;
      outline: none;
    }

    p {
      @include small($mobile: false);
    }
  }
}

.buttons {
  display: flex;
  gap: 15px;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;

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
    align-items: stretch;
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
