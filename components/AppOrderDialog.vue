<script setup lang="ts">
const props = defineProps({ modelValue: Boolean, contents: String });
const emit = defineEmits(["update:modelValue"]);
const isLoggedIn = computed(() => useUserStore().isLoggedIn);
const router = useRouter();

async function close() {
  emit("update:modelValue", false);

  if (isLoggedIn.value) {
    await navigateTo("/orderlist");
  } else {
    await navigateTo("/");
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue">
    <v-card class="mx-auto" max-width="400">
      <v-card-text>
        {{ contents }}
      </v-card-text>

      <v-card-actions>
        <v-btn @click="close">Хорошо</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
@use "../assets/styles" as *;
</style>
