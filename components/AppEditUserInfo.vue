<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useForm } from "vee-validate";
import { vMaska } from "maska/vue";
import * as yup from "yup";
import { PencilIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/vue/24/solid";
import type { StatusClass } from "@/types/types";

const nameEdit = ref(false);
const phoneEdit = ref(false);
const payMethodEdit = ref(false);

const { editUserName, editUserPhone, editUserPayMethod } = useEditUser();

const currentData = { ...useUsers().user };

// Name form
const nameSchema = yup.object({
  name: yup
    .string()
    .min(3, "Имя слишком короткое.")
    .required("Пожалуйста, введите имя."),
});

const {
  errors: nameErrors,
  handleSubmit: handleNameSubmit,
  defineField: defineNameField,
} = useForm({
  validationSchema: nameSchema,
  initialValues: {
    name: currentData.value?.name || "",
  },
});

const [name, nameAttrs] = defineNameField("name", {
  validateOnModelUpdate: false,
});

const nameStatus = ref<"success" | "error" | "pending" | null>(null);
const nameStatusMessage = ref("");

const nameStatusClass = ref<StatusClass>("");

const onNameSubmit = handleNameSubmit.withControlled(async (values) => {
  try {
    await nameSchema.validate({ name: values.name });
    nameStatus.value = "pending";
    nameStatusClass.value = "pending";
    nameStatusMessage.value = "Обновление...";
    const success = await editUserName(values.name);

    if (success) {
      currentData.value!.name = values.name;
      nameStatus.value = "success";
      nameStatusClass.value = "success";
      nameStatusMessage.value = "Данные успешно обновлены";
      nameEdit.value = false;
      setTimeout(() => {
        nameStatus.value = null;
      }, 300);
    } else {
      throw new Error("Ошибка обновления данных. Повторите попытку позже");
    }
  } catch (error) {
    nameStatus.value = "error";
    nameStatusClass.value = "error";
    nameStatusMessage.value =
      error instanceof Error ? error.message : "Произошла ошибка";
    setTimeout(() => {
      nameStatus.value = null;
    }, 300);
  }
});

// Phone form
const phoneSchema = yup.object({
  phone: yup
    .string()
    .min(18, "Номер телефона должен быть полностью заполнен.")
    .max(18, "Номер телефона не может быть длиннее 18 символов.")
    .required("Пожалуйста, введите номер телефона."),
});

const {
  errors: phoneErrors,
  handleSubmit: handlePhoneSubmit,
  defineField: definePhoneField,
} = useForm({
  validationSchema: phoneSchema,
  initialValues: {
    phone: currentData.value?.phone || "",
  },
});

const [phone, phoneAttrs] = definePhoneField("phone", {
  validateOnModelUpdate: false,
});

const phoneStatus = ref<"success" | "error" | "pending" | null>(null);
const phoneStatusMessage = ref("");

const phoneStatusClass = ref<StatusClass>("");

const onPhoneSubmit = handlePhoneSubmit.withControlled(async (values) => {
  try {
    await phoneSchema.validate({ phone: values.phone });
    phoneStatus.value = "pending";
    phoneStatusClass.value = "pending";
    phoneStatusMessage.value = "Обновление...";
    const success = await editUserPhone(values.phone);

    if (success) {
      currentData.value!.phone = values.phone;
      phoneStatus.value = "success";
      phoneStatusClass.value = "success";
      phoneStatusMessage.value = "Данные успешно обновлены";
      phoneEdit.value = false;
      setTimeout(() => {
        phoneStatus.value = null;
      }, 300);
    } else {
      throw new Error("Ошибка обновления данных. Повторите попытку позже");
    }
  } catch (error) {
    phoneStatus.value = "error";
    phoneStatusClass.value = "error";
    phoneStatusMessage.value =
      error instanceof Error ? error.message : "Произошла ошибка";
    setTimeout(() => {
      phoneStatus.value = null;
    }, 300);
  }
});

// PayMethod form
const payMethodSchema = yup.object({
  payMethod: yup
    .string()
    .oneOf(
      ["card-online", "card-on-delivery", "cash"],
      "Пожалуйста, выберите способ оплаты."
    )
    .required("Пожалуйста, выберите способ оплаты."),
});

const {
  errors: payMethodErrors,
  handleSubmit: handlePayMethodSubmit,
  defineField: definePayMethodField,
} = useForm({
  validationSchema: payMethodSchema,
  initialValues: {
    payMethod: currentData.value?.payMethod || "card-online",
  },
});

const [payMethod, payMethodAttrs] = definePayMethodField("payMethod", {
  validateOnModelUpdate: false,
});

const payMethodStatus = ref<"success" | "error" | "pending" | null>(null);
const payMethodStatusMessage = ref("");

const payMethodStatusClass = ref<StatusClass>("");

const onPayMethodSubmit = handlePayMethodSubmit.withControlled(
  async (values) => {
    try {
      await payMethodSchema.validate({ payMethod: values.payMethod });
      payMethodStatus.value = "pending";
      payMethodStatusClass.value = "pending";
      payMethodStatusMessage.value = "Обновление...";
      const success = await editUserPayMethod(values.payMethod);

      if (success) {
        currentData.value!.payMethod = values.payMethod;
        payMethodStatus.value = "success";
        payMethodStatusClass.value = "success";
        payMethodStatusMessage.value = "Данные успешно обновлены";
        payMethodEdit.value = false;
        setTimeout(() => {
          payMethodStatus.value = null;
        }, 300);
      } else {
        throw new Error("Ошибка обновления данных. Повторите попытку позже");
      }
    } catch (error) {
      payMethodStatus.value = "error";
      payMethodStatusClass.value = "error";
      payMethodStatusMessage.value =
        error instanceof Error ? error.message : "Произошла ошибка";
      setTimeout(() => {
        payMethodStatus.value = null;
      }, 300);
    }
  }
);

function cancelNameEdit() {
  nameEdit.value = false;
  nameStatusClass.value = "";
  nameStatusMessage.value = "";
  name.value = currentData.value?.name || "";
}

function cancelPhoneEdit() {
  phoneEdit.value = false;
  phoneStatusClass.value = "";
  phoneStatusMessage.value = "";
  phone.value = currentData.value?.phone || "";
}

function cancelPayMethodEdit() {
  payMethodEdit.value = false;
  payMethodStatusClass.value = "";
  payMethodStatusMessage.value = "";
  payMethod.value = currentData.value?.payMethod || "card-online";
}
</script>

<template>
  <div class="personal-data">
    <!-- Name Form -->
    <form
      class="personal-details"
      @submit.prevent="onNameSubmit"
      :class="{
        'success-flash': nameStatus === 'success',
        'error-flash': nameStatus === 'error',
      }"
    >
      <div class="field-header">
        <h2>Имя</h2>
        <div class="edit-controls">
          <PencilIcon
            v-if="!nameEdit"
            class="edit-icon"
            @click="nameEdit = true"
          />
          <template v-else>
            <CheckIcon
              class="edit-icon submit-icon"
              @click="nameErrors.name ? null : onNameSubmit()"
            />
            <XMarkIcon
              class="edit-icon cancel-icon"
              @click="cancelNameEdit()"
            />
          </template>
        </div>
      </div>
      <input
        v-if="nameEdit"
        type="text"
        placeholder="Алихан"
        name="name"
        v-model="name"
        v-bind="nameAttrs"
      />
      <p v-else class="value-text">{{ currentData?.name || "Не указано" }}</p>
      <p
        v-if="nameErrors.name || nameStatusMessage"
        class="status-text"
        :class="nameErrors.name ? 'error' : nameStatusClass"
      >
        {{ nameErrors.name || nameStatusMessage }}
      </p>
    </form>

    <!-- Phone Form -->
    <form
      class="personal-details"
      @submit.prevent="onPhoneSubmit"
      :class="{
        'success-flash': phoneStatus === 'success',
        'error-flash': phoneStatus === 'error',
      }"
    >
      <div class="field-header">
        <h2>Номер телефона</h2>
        <div class="edit-controls">
          <PencilIcon
            v-if="!phoneEdit"
            class="edit-icon"
            @click="phoneEdit = true"
          />
          <template v-else>
            <CheckIcon
              class="edit-icon submit-icon"
              @click="phoneErrors.phone ? null : onPhoneSubmit()"
            />
            <XMarkIcon
              class="edit-icon cancel-icon"
              @click="cancelPhoneEdit()"
            />
          </template>
        </div>
      </div>
      <input
        type="text"
        placeholder="+7 (999) 999 99 99"
        name="phone"
        v-maska="'+7 (###) ### ## ##'"
        v-model="phone"
        v-bind="phoneAttrs"
        :disabled="!phoneEdit"
      />
      <p
        v-if="phoneErrors.phone || phoneStatusMessage"
        class="status-text"
        :class="phoneErrors.phone ? 'error' : phoneStatusClass"
      >
        {{ phoneErrors.phone || phoneStatusMessage }}
      </p>
    </form>

    <!-- PayMethod Form -->
    <form
      class="personal-details"
      @submit.prevent="onPayMethodSubmit"
      :class="{
        'success-flash': payMethodStatus === 'success',
        'error-flash': payMethodStatus === 'error',
      }"
    >
      <div class="field-header">
        <h2>Способ оплаты</h2>
        <div class="edit-controls">
          <PencilIcon
            v-if="!payMethodEdit"
            class="edit-icon"
            @click="payMethodEdit = true"
          />
          <template v-else>
            <CheckIcon
              class="edit-icon submit-icon"
              @click="payMethodErrors.payMethod ? null : onPayMethodSubmit()"
            />
            <XMarkIcon
              class="edit-icon cancel-icon"
              @click="cancelPayMethodEdit()"
            />
          </template>
        </div>
      </div>
      <Transition name="pay-methods" mode="out-in">
        <div class="pay-methods" v-if="payMethodEdit">
          <div class="pay-radio">
            <input
              type="radio"
              id="card-online"
              value="card-online"
              v-model="payMethod"
              v-bind="payMethodAttrs"
              :disabled="!payMethodEdit"
              class="pay-button"
            />
            <label for="card-online" class="pay-label">Картой онлайн</label>
          </div>
          <div class="pay-radio">
            <input
              type="radio"
              id="card-on-delivery"
              value="card-on-delivery"
              v-model="payMethod"
              v-bind="payMethodAttrs"
              :disabled="!payMethodEdit"
              class="pay-button"
            />
            <label for="card-on-delivery" class="pay-label"
              >Картой при получении</label
            >
          </div>
          <div class="pay-radio">
            <input
              type="radio"
              id="cash"
              value="cash"
              v-model="payMethod"
              v-bind="payMethodAttrs"
              :disabled="!payMethodEdit"
              class="pay-button"
            />
            <label for="cash" class="pay-label">Наличными при получении</label>
          </div>
        </div>
        <p v-else class="value-text">
          {{
            payMethod === "card-online"
              ? "Картой онлайн"
              : payMethod === "card-on-delivery"
              ? "Картой при получении"
              : payMethod === "cash"
              ? "Наличными при получении"
              : "Не указано"
          }}
        </p>
      </Transition>
      <p
        v-if="payMethodErrors.payMethod || payMethodStatusMessage"
        class="status-text"
        :class="payMethodErrors.payMethod ? 'error' : payMethodStatusClass"
      >
        {{ payMethodErrors.payMethod || payMethodStatusMessage }}
      </p>
    </form>
  </div>
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

.disabled {
  ::placeholder {
    color: black;
  }

  .pay-button:checked {
    border-color: black;
  }

  .pay-label {
    color: black;
  }
}

.personal-data {
  display: flex;
  gap: 15px;
  flex-direction: column;
  width: 100%;

  .personal-details {
    display: flex;
    padding: 15px 20px;
    gap: 10px;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    will-change: transform, opacity;
    transition: background-color 2s ease, box-shadow 2s ease;

    h2 {
      @include medium-bold($mobile: false);
    }

    input:not([type="radio"]),
    p.value-text {
      @include medium($mobile: false);
      border: none;
      outline: none;
      color: black;

      &:disabled {
        color: black;
      }
    }

    p {
      @include medium($mobile: false);
    }

    &.success-flash {
      background-color: rgba(0, 255, 0, 0.15);
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.75);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    &.error-flash {
      background-color: rgba(255, 0, 0, 0.15);
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.75);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    &.pending {
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.75);
      transition: background-color 1s ease, box-shadow 1s ease;
    }
  }
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.edit-controls {
  display: flex;
  gap: 8px;
}

.edit-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: $outline-clr;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.submit-icon,
.cancel-icon {
  color: black;
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 35px;
  align-self: stretch;
  flex-direction: column;
  width: 100%;
}

.main-data {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 25px;
  flex: 1 0 0;
  width: 100%;
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

  input:not([type="radio"]) {
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

.pay-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
  max-height: 200px; // Adjust based on your content
  opacity: 1;

  &.disabled {
    .pay-label {
      color: black;
    }
  }
}

.pay-radio {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pay-button {
  appearance: none;
  -webkit-appearance: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid black;
  margin: 0;
  padding: 0;
  background-color: white;
  cursor: pointer;

  &:checked {
    border: 6px solid black;
    background-color: white;
  }

  &:disabled {
    opacity: 1;
    cursor: not-allowed;
  }
}

.pay-label {
  color: $outline-clr;
  cursor: pointer;
  @include medium($mobile: false);
  transition: all 0.3s ease;
  max-height: 50px; // Adjust based on your content
  opacity: 1;
}

.disabled {
  .pay-button {
    cursor: default;
    &:checked {
      border-color: black;
    }
  }

  .pay-label {
    color: black;
    cursor: default;
  }
}

.cost-line,
.total-line {
  display: flex;
  justify-content: space-between;
}

.error-text {
  color: #f44336; /* Red color for error messages */
  @include small($mobile: false);
}

.value-text {
  @include medium($mobile: false);
  color: black;
  transition: all 0.3s ease;
  max-height: 50px; // Adjust based on your content
  opacity: 1;
}

// Add these classes for enter/leave transitions
.pay-methods-enter-from,
.pay-methods-leave-to {
  max-height: 0;
  opacity: 0;
}

.pay-methods-enter-active,
.pay-methods-leave-active {
  overflow: hidden;
  transition: all 0.3s ease;
}

.status-text {
  @include small($mobile: false);

  &.error {
    color: #f44336;
  }
  &.success {
    color: #4caf50;
  }
  &.pending {
    color: #2196f3;
  }
}
</style>
