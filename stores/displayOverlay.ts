export const useDisplayOverlayStore = defineStore("displayOverlay", () => {
  const overlayVisible = ref(false);
  return { overlayVisible };
});
