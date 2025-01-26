<template>
  <section>
    <h1>Контакты</h1>
    <div class="main-text">
      <p>Казахстан, г. Экибазтус, ул. Ауезова, 49Б</p>
      <br />
      <p><b>Часы работы:</b></p>
      <br />
      <p>Пн-пт: 10-22</p>
      <p>Сб-вс: 12-24</p>
      <br />
      <p>Тел. 0118 999 881 999 119 725 3</p>
      <p>Email. moapizza@yahoo.kz</p>
    </div>
    <div class="map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4532.357757375187!2d75.3193220317402!3d51.72781249298126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x42582b0fa1138419%3A0xeeff40329954178!2sTd%20Sary-Arka!5e0!3m2!1sen!2sru!4v1691690023596!5m2!1sen!2sru"
        width="600"
        height="450"
        style="border: 0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      >
      </iframe>
    </div>
  </section>
</template>

<script setup>
useSeoMeta({
  title: "Контакты - Пиццерия в Экибазтузе",
  description:
    "Свяжитесь с нами: адрес, телефон и часы работы пиццерии в Экибазтузе.",
  ogTitle: "Контакты пиццерии в Экибазтузе",
  ogDescription:
    "Наш адрес: ул. Ауезова, 49Б. Часы работы и контактная информация.",
});
</script>

<style scoped lang="scss">
@use "../assets/styles" as *;

section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 70px;
  align-self: stretch;
}

h1 {
  width: 199px;
  height: 33px;
  color: #000;
  /* logo-main */
  @include logo-main($mobile: false);
}

p {
  align-self: stretch;
  color: #000;
  /* medium */
  @include medium($mobile: false);
}

.map {
  max-width: 500px;
  max-height: 500px;
  flex: 1 0 0;
  align-self: stretch;
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25));
}

iframe {
  max-width: 500px;
  max-height: 500px;
  flex: 1 0 0;
  align-self: stretch;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  section {
    gap: 45px;
  }

  h1 {
    @include logo-main($mobile: true);
  }

  .map {
    flex-shrink: 0;
    max-width: 100%;
  }

  iframe {
    max-width: 320px;
  }
}
</style>
