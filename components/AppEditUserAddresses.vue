<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import type { Address } from "@/types/types";
import { PencilIcon, PlusCircleIcon } from "@heroicons/vue/24/outline";
import {
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/vue/24/solid";
import type { StatusClass } from "@/types/types";

const showAddAddress = ref(false);
const newAddress = ref("");
const addresses = ref(store.state.users.user.addresses || []);
const editingIndex = ref<number | null>(null);
const editedAddress = ref("");
const addressStatuses = ref<{
  [key: string]: "success" | "error" | "pending" | null;
}>({});

// For new address
const newAddressStatusClass = ref<StatusClass>("");
const newAddressStatusMessage = ref("");

// For editing existing addresses
const addressStatusClasses = ref<{ [key: string]: StatusClass }>({});
const addressStatusMessages = ref<{ [key: string]: string }>({});

const addressSchema = yup.object({
  address: yup
    .string()
    .min(3, "Адрес слишком короткий.")
    .required("Пожалуйста, введите адрес доставки."),
});

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: addressSchema,
});

const [address, addressAttrs] = defineField("address", {
  validateOnModelUpdate: false,
});

// For new address
const { errors: newAddressErrors, validateField: validateNewAddress } = useForm(
  {
    validationSchema: addressSchema,
  }
);

// For editing addresses - separate validation for each address
const addressErrors = ref<{ [key: string]: { address?: string } }>({});
const validateAddress = (addressId: string, value: string) => {
  try {
    addressSchema.validateSync({ address: value });
    addressErrors.value[addressId] = {};
    return true;
  } catch (err) {
    addressErrors.value[addressId] = {
      address: err instanceof Error ? err.message : "Invalid address",
    };
    return false;
  }
};

async function addAddress(place: string) {
  try {
    const isValid = await validateNewAddress("address", place);
    if (!isValid) return;

    newAddressStatusClass.value = "pending";
    newAddressStatusMessage.value = "Обновление...";
    addressStatuses.value["new"] = "pending";
    const success = await store.dispatch("addUserAddress", place);

    if (success) {
      const newAddresses = store.state.users.user.addresses;
      const newAddressId = newAddresses[newAddresses.length - 1].id;
      addressStatuses.value[newAddressId] = "success";
      newAddressStatusClass.value = "success";
      newAddressStatusMessage.value = "Адрес успешно добавлен";
      setTimeout(() => {
        addressStatuses.value[newAddressId] = null;
      }, 300);
      setTimeout(() => {
        newAddressStatusClass.value = "";
        newAddressStatusMessage.value = "";
      }, 2000);
      newAddress.value = "";
      showAddAddress.value = false;
      addresses.value = newAddresses;
    }
  } catch (err) {
    addressStatuses.value["new"] = "error";
    newAddressStatusClass.value = "error";
    newAddressStatusMessage.value = "Ошибка при добавлении адреса";
    // handle error here
    setTimeout(() => {
      addressStatuses.value["new"] = null;
    }, 300);
  }
}

async function startEditAddress(index: number) {
  editingIndex.value = index;
  editedAddress.value = addresses.value[index].place;
}

async function saveEditedAddress(index: number) {
  const addressToEdit = addresses.value[index];
  try {
    const isValid = validateAddress(addressToEdit.id, editedAddress.value);
    if (!isValid) return;

    addressStatusClasses.value[addressToEdit.id] = "pending";
    addressStatusMessages.value[addressToEdit.id] = "Обновление...";
    const success = await store.dispatch("editUserAddress", {
      addressId: addressToEdit.id,
      newPlace: editedAddress.value,
    });

    if (success) {
      addressStatuses.value[addressToEdit.id] = "success";
      addressStatusClasses.value[addressToEdit.id] = "success";
      addressStatusMessages.value[addressToEdit.id] =
        "Адрес успешно отредактирован";
      setTimeout(() => {
        addressStatusMessages.value[addressToEdit.id] = "";
        addressStatusClasses.value[addressToEdit.id] = "";
      }, 2000);
      setTimeout(() => {
        addressStatuses.value[addressToEdit.id] = null;
      }, 300);
      addresses.value = store.state.users.user.addresses;
      editingIndex.value = null;
      editedAddress.value = "";
    }
  } catch (err) {
    addressStatuses.value[addressToEdit.id] = "error";
    addressStatusClasses.value[addressToEdit.id] = "error";
    addressStatusMessages.value[addressToEdit.id] =
      "Ошибка при редактировании адреса";
    setTimeout(() => {
      addressStatuses.value[addressToEdit.id] = null;
    }, 300);
  }
}

async function deleteAddress(index: number) {
  const addressToDelete = addresses.value[index];
  try {
    addressStatuses.value[addressToDelete.id] = "pending";
    const success = await store.dispatch(
      "deleteUserAddress",
      addressToDelete.id
    );

    if (success) {
      addresses.value = store.state.users.user.addresses;
    }
  } catch (err) {
    addressStatuses.value[addressToDelete.id] = "error";
    setTimeout(() => {
      addressStatuses.value[addressToDelete.id] = null;
    }, 300);
  }
}

async function makeMainAddress(addressId: string) {
  try {
    addressStatuses.value[addressId] = "pending";
    await store.dispatch("setMainAddress", addressId);
    addresses.value = store.state.users.user.addresses;
    addressStatuses.value[addressId] = "success";
    setTimeout(() => {
      addressStatuses.value[addressId] = null;
    }, 300);
  } catch (err) {
    addressStatuses.value[addressId] = "error";
    setTimeout(() => {
      addressStatuses.value[addressId] = null;
    }, 300);
  }
}

function cancelEdit() {
  editingIndex.value = null;
  editedAddress.value = "";
}

function cancelAddAddress() {
  newAddress.value = "";
  showAddAddress.value = false;
}
</script>

<template>
  <div class="personal-data">
    <div class="addresses-header">
      <h2>Адреса доставки</h2>
      <PlusCircleIcon
        v-if="!showAddAddress"
        class="add-icon"
        @click="showAddAddress = true"
      />
    </div>

    <div class="addresses-list">
      <!-- Existing Addresses -->
      <TransitionGroup name="list">
        <div
          v-for="(address, index) in addresses"
          :key="address.id"
          class="personal-details"
        >
          <div
            class="personal-details-container"
            :class="{
              'success-flash': addressStatuses[address.id] === 'success',
              'error-flash': addressStatuses[address.id] === 'error',
              pending: addressStatuses[address.id] === 'pending',
            }"
          >
            <div class="field-header">
              <h3>Адрес {{ index + 1 }}</h3>
              <div class="edit-controls">
                <template v-if="editingIndex === index">
                  <CheckIcon
                    class="edit-icon submit-icon"
                    @click="saveEditedAddress(index)"
                  />
                  <XMarkIcon
                    class="edit-icon cancel-icon"
                    @click="cancelEdit"
                  />
                </template>
                <template v-else>
                  <div class="address-controls">
                    <Transition name="fade" mode="out-in">
                      <p v-if="address.main" class="main-address" :key="'main'">
                        Основной
                      </p>
                      <button
                        v-else
                        class="make-main-btn"
                        @click="makeMainAddress(address.id)"
                        :key="'button'"
                      >
                        Сделать основным
                      </button>
                    </Transition>
                    <PencilIcon
                      class="edit-icon"
                      @click="startEditAddress(index)"
                    />
                    <TrashIcon
                      v-if="addresses.length > 1"
                      class="edit-icon delete-icon"
                      @click="deleteAddress(index)"
                    />
                  </div>
                </template>
              </div>
            </div>
            <template v-if="editingIndex === index">
              <input
                type="text"
                placeholder="г. Экибазтуз, ул. Введения Адреса, д. 1, кв. 15"
                v-model="editedAddress"
              />
            </template>
            <p v-else>{{ address.place }}</p>
            <Transition name="fade" mode="out-in">
              <p
                v-if="
                  addressErrors[address.id]?.address ||
                  addressStatusMessages[address.id]
                "
                class="status-text"
                :class="
                  addressErrors[address.id]?.address
                    ? 'error'
                    : addressStatusClasses[address.id]
                "
              >
                {{
                  addressErrors[address.id]?.address ||
                  addressStatusMessages[address.id]
                }}
              </p>
            </Transition>
          </div>
        </div>
      </TransitionGroup>

      <!-- New Address Form -->
      <Transition name="slide">
        <div v-if="showAddAddress" class="personal-details">
          <div
            class="personal-details-container"
            :class="{
              'success-flash': addressStatuses['new'] === 'success',
              'error-flash': addressStatuses['new'] === 'error',
              pending: addressStatuses['new'] === 'pending',
            }"
          >
            <div class="field-header">
              <h3>Новый адрес</h3>
              <div class="edit-controls">
                <CheckIcon
                  class="edit-icon submit-icon"
                  @click="addAddress(newAddress)"
                />
                <XMarkIcon
                  class="edit-icon cancel-icon"
                  @click="cancelAddAddress"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="г. Экибазтуз, ул. Введения Адреса, д. 1, кв. 15"
              v-model="newAddress"
              v-bind="addressAttrs"
            />
            <Transition name="fade">
              <p
                v-if="newAddressErrors.address || newAddressStatusMessage"
                class="status-text"
                :class="
                  newAddressErrors.address ? 'error' : newAddressStatusClass
                "
              >
                {{ newAddressErrors.address || newAddressStatusMessage }}
              </p>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.personal-data {
  display: flex;
  gap: 15px;
  flex-direction: column;
}

.addresses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  h2 {
    @include medium-bold($mobile: false);
  }
}

.addresses-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
}

.personal-details {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  will-change: transform, opacity, max-height;
  transition: background-color 2s ease, box-shadow 2s ease;

  .personal-details-container {
    display: flex;
    padding: 15px 20px;
    gap: 10px;
    flex-direction: column;
    transition: all 0.3s linear;
  }

  h3 {
    @include medium-bold($mobile: false);
    font-weight: 700;
  }

  input {
    @include medium($mobile: false);
    border: none;
    outline: none;
  }

  p {
    @include medium($mobile: false);
  }

  .main-address {
    @include small-bold($mobile: false);
  }

  .make-main-btn {
    @include small($mobile: false);
  }

  .make-main-btn:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2));
  }

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

.add-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
  color: $outline-clr;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

.submit-icon,
.cancel-icon,
.delete-icon {
  color: black;
}

/* Transitions for list items */
.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}

/* Transitions for add address form */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
  max-height: 200px; /* Adjust based on your content */
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-30px);
}

.error-text {
  color: #f44336; /* Red color for error messages */
  @include small($mobile: false);
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

.fade-enter-active,
.fade-leave-active {
  transition: max-height 0.3s linear, opacity 0.3s linear;
  max-height: 2em;
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.address-controls {
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
}

// .fade-leave-active {
//   position: absolute;
//   width: 100%;
// }
</style>
