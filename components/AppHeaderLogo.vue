<script setup lang="ts">
const router = useRouter();

const goToMenu = () => {
  navigateTo("/menu");
};
</script>

<template>
  <section>
    <NuxtLink class="link" to="/menu">
      <img src="/img/logo.svg" alt="Moa pizza logo" />
    </NuxtLink>
    <div>
      <h1>MOA PIZZA</h1>
      <p>Пиццерия №1 в Экибазтузе</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateX(2px);

    img {
      filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.3));
    }
  }
}

section {
  display: flex;
  align-items: center;
  gap: 31px;
  transition: filter 0.2s ease;
}

img {
  width: 76px;
  height: 69px;
  fill: $fill2-clr;
  stroke-width: 1px;
  stroke: #000;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  transition: filter 0.2s ease;
}

div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

h1 {
  width: 255px;
  height: 31px;
  color: #000;

  /* logo-main */
  @include logo-main($mobile: false);
}

p {
  width: 341px;
  height: 31px;
  color: #000;

  /* bigger-subtext */
  @include bigger-subtext($mobile: false);
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  img {
    width: 2.77175rem;
    height: 2.5rem;
  }

  p {
    display: none;
  }

  h1 {
    @include logo-main($mobile: true);
  }
}
</style>
