<script setup lang="ts">
const { user } = storeToRefs(useUserStore());
const { fetchOrders } = useOrderStore();
const { orders } = storeToRefs(useOrderStore());
const loading = ref(true);
const errorMessage = ref("");

const uuid = computed(() => user.value?.id);

const showDetails = ref(orders.value.map((order: any) => false));

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const openDetails = async (id: number) => {
  await navigateTo(`/order/${id}`);
};

useSeoMeta({
  title: "Мои заказы",
  description: "Мои заказы",
  ogTitle: "Мои заказы",
  ogDescription: "Мои заказы",
  ogImage: "/logo.png",
});

definePageMeta({
  layout: "default",
  middleware: "auth",
});

onMounted(async () => {
  loading.value = true;
  if (!uuid.value) {
    errorMessage.value = "Пользователь не авторизован";
    loading.value = false;
    return;
  }
  try {
    const success = await fetchOrders(uuid.value);

    if (success) {
      errorMessage.value = "";
    } else {
      throw new Error(
        "Не удалось загрузить заказы. Пожалуйста, попробуйте позже."
      );
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Не удалось загрузить заказы. Пожалуйста, попробуйте позже.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section>
    <h1>Мои заказы</h1>
    <div v-if="loading" class="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="30"
      ></v-progress-circular>
    </div>

    <div v-else-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-else-if="orders.length === 0" class="no-orders">
      <h2>У вас пока нет заказов</h2>
    </div>

    <div class="main-content" v-else>
      <div class="order-container" v-for="order in orders" :key="order.id">
        <h2>Заказ #{{ order.id }}</h2>
        <div class="order-details">
          <p>Дата: {{ formatDate(order.created_at ?? "") }}</p>
          <p>Итого: {{ order.totalPrice }} тг</p>
          <p>
            Статус:
            <span :class="['status', order.status.toLowerCase()]">
              <span v-if="order.status === 'cooking'">Готовится</span>
              <span v-if="order.status === 'delivering'">Доставляется</span>
              <span v-if="order.status === 'finished'">Доставлен</span>
            </span>
          </p>
          <p
            class="details-link"
            @click="
              if (order.id) showDetails[order.id] = !showDetails[order.id];
            "
          >
            Детали заказа
          </p>
        </div>
        <Transition name="dropdown" mode="out-in">
          <div
            class="order-items"
            v-show="order.id ? showDetails[order.id] : false"
          >
            <template v-for="item in order.contents" :key="item.id">
              <p>
                {{ item.amount }} x {{ item.heading }} |
                {{ item.amount * item.price }} тг
              </p>
            </template>
          </div>
        </Transition>
      </div>
    </div>
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

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 35px;
  align-self: stretch;
  flex-direction: column;
  width: 100%;
}

.order-container {
  display: flex;
  padding: 15px 20px;
  gap: 10px;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  align-self: stretch;

  .order-details {
    display: flex;
    gap: 10px;
    flex-direction: row;
  }
}
.order-items {
  transition: all 0.3s ease;
  max-height: 400px; // Adjust based on your content
}

// Add these classes for enter/leave transitions
.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  overflow: hidden;
  transition: all 0.3s ease;
}

h1 {
  color: $outline-clr;
  /* logo-main */
  @include logo-main($mobile: false);
}

h2 {
  color: $outline-clr;
  @include bigger-bold($mobile: false);
}

.status.cooking {
  color: #856404;
}

.status.delivering {
  color: #004085;
}

.status.finished {
  color: #155724;
}

p {
  @include small($mobile: false);
}

.loading,
.error,
.no-orders {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}

.details-link {
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 768px) {
  .orders-table {
    font-size: 14px;
  }

  .orders-table th,
  .orders-table td {
    padding: 8px;
  }
}
</style>
