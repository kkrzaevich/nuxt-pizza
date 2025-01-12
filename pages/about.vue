<template>
  <section>
    <h1>О нас</h1>
    <div class="main-text">
      <p>
        Добро пожаловать в пиццерию в Экибазтузе, где можно насладиться самой
        вкусной пиццей в городе! Наша пиццерия известна своим качественным и
        разнообразным меню, отвечающим вкусам самых взыскательных гурманов.
      </p>
      <br />
      <p>
        Мы гордимся своими уникальными рецептами теста и соусов, которые делают
        нашу пиццу по-настоящему неповторимой. Наши повара искусно комбинируют
        свежие и качественные ингредиенты, чтобы создать идеальное сочетание
        вкусов. Вы можете выбрать из разнообразных вариантов пиццы, включая
        классические сочетания, а также более экзотические варианты с необычными
        начинками.
      </p>
      <br />
      <p>
        Мы также предлагаем различные размеры пиццы, чтобы каждый мог найти
        оптимальный вариант для себя. Вы можете выбрать индивидуальную пиццу для
        одного человека, среднюю для пары или большую пиццу, которую можно
        поделить с друзьями или семьей. Кроме того, у нас есть возможность
        создать свою собственную пиццу, выбрав свои любимые ингредиенты.
      </p>
      <br />
      <p>
        Мы также гордимся своим уютным и дружелюбным интерьером. Наша пиццерия
        предлагает комфортное место для проведения времени с семьей и друзьями.
        У нас есть удобные столы и диваны, а также приветливый персонал, готовый
        помочь вам с выбором и обслуживанием.
      </p>
      <br />
      <p>
        Если вы ищете место, где можно насладиться вкусной пиццей в Экибазтузе,
        загляните к нам в пиццерию. Мы уверены, что наша пицца оправдает ваши
        ожидания и станет вашим любимым местом для обеда или ужина.
      </p>
    </div>
    <div class="images">
      <img src="../../img/about1.jpg" alt="some photo of trattoria" />
      <img src="../../img/about2.jpg" alt="some photo of trattoria" />
    </div>
  </section>
</template>

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

.images {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  align-self: stretch;
}

img {
  height: 468px;
  flex: 1;
  width: 0;
  object-fit: cover;
  object-position: 50% 80%;
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

  p {
    @include medium($mobile: true);
  }
}
</style>
