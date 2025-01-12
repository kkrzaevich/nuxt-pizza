<script setup lang="ts">
const displayOverlayFlag = ref(false);

const { overlayVisible } = useDisplayOverlay();

watch(overlayVisible, () => {
  displayOverlayFlag.value = overlayVisible.value;
});
</script>

<template>
  <section>
    <Transition name="fade">
      <div v-if="displayOverlayFlag" class="overlay">
        <AppOverlay />
      </div>
    </Transition>
    <div :class="`page ${displayOverlayFlag ? 'disabled' : ''}`">
      <AppHeader />

      <RouterView v-slot="{ Component }">
        <Transition name="fly-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>

      <AppFooter />
    </div>
    <AppFloatingCartButton />
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.disabled {
  height: 100%;
  overflow-y: hidden;
  filter: blur(3px);
}

.overlay {
  position: fixed;
  top: 50vh;
  left: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.page {
  display: flex;
  min-width: 460px;
  flex-direction: column;
  align-items: center;
  gap: 70px;
  flex: 1 0 0;
  transition: filter 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fly-fade-enter-active {
  transition: all 0.3s;
}

.fly-fade-leave-active {
  transition: all 0.3s;
}

.fly-fade-enter-from {
  transform: translateX(120px);
  opacity: 0;
}

.fly-fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: $break-tablet) {
  .overlay {
    position: fixed;
    top: 50vh;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: none;
  }
}

@media screen and (max-width: $break-mobile) {
  .page {
    min-width: 320px;
    gap: 45px;
  }
}
</style>
