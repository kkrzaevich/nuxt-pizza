<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { PencilIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon, CheckIcon } from "@heroicons/vue/24/solid";

const emailEdit = ref(false);
const { editUserEmail } = useEditUser();
const { user: currentData } = useUsers();

const emailSchema = yup.object({
  email: yup
    .string()
    .email("Неверный формат email")
    .required("Пожалуйста, введите email"),
});

const {
  errors: emailErrors,
  handleSubmit,
  defineField,
} = useForm({
  validationSchema: emailSchema,
  initialValues: {
    email: currentData.value?.email || "",
  },
});

const [email, emailAttrs] = defineField("email", {
  validateOnModelUpdate: false,
});

const emailStatus = ref<"success" | "error" | "pending" | null>(null);
type StatusClass = "success" | "error" | "pending" | "";
const emailStatusClass = ref<StatusClass>("");
const emailStatusMessage = ref("");

function cancelEmailEdit() {
  emailEdit.value = false;
  emailStatusClass.value = "";
  emailStatusMessage.value = "";
  email.value = currentData.value?.email || "";
}

const onEmailSubmit = handleSubmit.withControlled(async (values) => {
  try {
    await emailSchema.validate({ email: values.email });
    emailStatus.value = "pending";
    emailStatusClass.value = "pending";
    emailStatusMessage.value = "Обновление...";
    const success = await editUserEmail(values.email);

    if (success) {
      emailStatus.value = "success";
      emailStatusClass.value = "success";
      emailStatusMessage.value = `Ссылка для подтверждения отправлена на ваш новый email: ${values.email}. Пожалуйста, подтвердите ваш email`;
      emailEdit.value = false;
      setTimeout(() => {
        emailStatus.value = null;
      }, 300);
    } else {
      throw new Error("Ошибка обновления email. Повторите попытку позже");
    }
  } catch (error) {
    emailStatus.value = "error";
    emailStatusClass.value = "error";
    emailStatusMessage.value =
      error instanceof Error ? error.message : "Произошла ошибка";
    setTimeout(() => {
      emailStatus.value = null;
    }, 300);
  }
});
</script>

<template>
  <div class="personal-data">
    <form
      class="personal-details"
      @submit.prevent="onEmailSubmit"
      :class="{
        'success-flash': emailStatus === 'success',
        'error-flash': emailStatus === 'error',
      }"
    >
      <div class="field-header">
        <h2>Email</h2>
        <div class="edit-controls">
          <PencilIcon
            v-if="!emailEdit"
            class="edit-icon"
            @click="emailEdit = true"
          />
          <template v-else>
            <CheckIcon class="edit-icon submit-icon" @click="onEmailSubmit" />
            <XMarkIcon class="edit-icon cancel-icon" @click="cancelEmailEdit" />
          </template>
        </div>
      </div>
      <input
        v-if="emailEdit"
        type="text"
        placeholder="alihan@mail.kz"
        name="email"
        v-model="email"
        v-bind="emailAttrs"
      />
      <p v-else class="value-text">{{ currentData?.email || "Не указано" }}</p>
      <Transition name="fade">
        <p
          v-if="emailErrors.email || emailStatusMessage"
          class="status-text"
          :class="emailErrors.email ? 'error' : emailStatusClass"
        >
          {{ emailErrors.email || emailStatusMessage }}
        </p>
      </Transition>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.personal-data {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 25px;
  flex: 1 0 0;
  width: 100%;

  .personal-details {
    display: flex;
    padding: 15px 20px;
    gap: 10px;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    will-change: transform, opacity;
    transition: background-color 2s ease, box-shadow 2s ease;

    &.success-flash {
      background-color: rgba(0, 255, 0, 0.15);
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.75);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    &.error-flash {
      background-color: red;
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.15);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    &.pending {
      box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.75);
      transition: background-color 1s ease, box-shadow 1s ease;
    }

    h2 {
      @include medium-bold($mobile: false);
    }

    input {
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

.status-text {
  @include small($mobile: false);
  margin: 0;
  overflow: hidden;

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

.value-text {
  @include medium($mobile: false);
  color: black;
}
</style>
