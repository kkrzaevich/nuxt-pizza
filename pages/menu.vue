<template>
  <div>
    <AppMenuChoose />
    <AppMenuMenu />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 70px;
  align-self: stretch;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  div {
    gap: 45px;
  }
}
</style>
