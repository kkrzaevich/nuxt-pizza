<template>
  <hr />
  <section class="footer">
    <p class="copyright">МОА ПИЦЦА © 2024</p>
    <div class="social">
      <a href="https://www.instagram.com/" target="_blank"
        ><img src="/img/social1.svg" alt="instagram icon"
      /></a>
      <a href="https://www.whatsapp.com/" target="_blank"
        ><img src="/img/social2.svg" alt="whatsapp icon"
      /></a>
      <a href="https://www.telegram.com/" target="_blank"
        ><img src="/img/social3.svg" alt="telegram icon"
      /></a>
      <a href="https://www.vk.com/" target="_blank"
        ><img src="/img/social4.svg" alt="vk icon"
      /></a>
    </div>
    <div class="contacts">
      <h1>Тел. 0118 999 881 999 119 725 3</h1>
      <p>moapizza@yahoo.kz</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

hr {
  border: 0.5px solid #e4a5ff;
  width: 100%;
}

img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
  row-gap: 20px;
  align-self: stretch;
  flex-wrap: wrap;
}

.copyright {
  min-width: 400px;
  flex: 1 0 0;

  color: #000;
  /* bigger */
  @include bigger($mobile: false);
}

.social {
  display: flex;
  min-width: 170px;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

img:hover {
  filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.495));
}

img {
  transition-property: filter;
  transition-duration: 0.35s;
}

.contacts {
  display: flex;
  min-width: 400px;
  padding-left: 0px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 7px;
  flex: 1 0 0;
}

.contacts {
  h1 {
    color: #000;
    /* medium-bold */
    @include medium-bold($mobile: false);
  }
}

.contacts {
  p {
    color: #000;
    /* medium */
    @include medium($mobile: false);
  }
}

@media screen and (max-width: $break-tablet) {
  .contacts {
    padding-left: unset;
    align-items: flex-start;
  }
}

@media screen and (max-width: $break-mobile) {
  .contacts {
    min-width: unset;
    width: 100%;
  }

  .social {
    min-width: unset;
    width: 100%;
    align-items: flex-start;
    justify-content: left;
  }

  .copyright {
    min-width: unset;
  }
}
</style>
