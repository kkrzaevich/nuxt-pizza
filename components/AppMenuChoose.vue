<script setup lang="ts">
const product1 = {
  name: "Пицца",
  src: "./img/product-type1.jpg",
  href: "#pizza",
};
const product2 = {
  name: "Напитки",
  src: "./img/product-type2.jpg",
  href: "#drinks",
};
const product3 = {
  name: "Закуски",
  src: "./img/product-type3.jpg",
  href: "#snacks",
};
</script>

<template>
  <section>
    <div>
      <AppMenuProductType
        :name="product1.name"
        :src="product1.src"
        :href="product1.href"
      />
      <AppMenuProductType
        :name="product2.name"
        :src="product2.src"
        :href="product2.href"
      />
      <AppMenuProductType
        :name="product3.name"
        :src="product3.src"
        :href="product3.href"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

section {
  display: flex;
  padding: 25px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: $fill2-clr;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  section {
    padding: 10px;
  }

  div {
    gap: 15px;
  }
}
</style>
