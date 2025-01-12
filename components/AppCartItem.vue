<script setup lang="ts">
import { type CartItem } from "@/types/types";

const {
  cart,
  selectedItem,
  incrementItemAmountInCart,
  decrementItemAmountInCart,
  deleteItemFromCart,
} = useItems();

const emit = defineEmits(["updateItemAmount"]);

export interface Props {
  item: CartItem;
}

const props = withDefaults(defineProps<Props>(), {
  item: () => {
    return {
      heading: "Супер пицца",
      description: "Самая вкусная в Казахстане",
      price: 2500,
      weight: 750,
      ingredients: "вода, сахар, соль, рог единорога",
      src: "./img/pizza1.png",
      amount: 1,
    };
  },
});

function increment() {
  if (props.item.amount && props.item.amount < 99) {
    incrementItemAmountInCart(props.item.heading);
  }
}

function decrement() {
  if (props.item.amount && props.item.amount >= 2) {
    decrementItemAmountInCart(props.item.heading);
  }
}

function deleteItem() {
  deleteItemFromCart(props.item.heading);
}
</script>

<template>
  <section class="desktop">
    <img class="item-pic" :src="item.src" alt="item pic" />
    <div class="annotations">
      <h1>{{ item.heading }}</h1>
      <p>{{ item.price }} тг.</p>
    </div>
    <div class="delete">
      <button class="delete-button" @click="deleteItem">
        <img class="delete-pic" src="/img/trash.svg" alt="delete item" />
      </button>
      <div class="amount">
        <button @click="decrement">
          <span class="amount-text">-</span>
        </button>
        <p>
          <span class="amount-text">{{ item.amount }}</span>
        </p>
        <button @click="increment">
          <span class="amount-text">+</span>
        </button>
      </div>
    </div>
  </section>

  <section class="mobile">
    <div class="image-container">
      <img class="item-pic" :src="item.src" alt="item pic" />
      <button class="delete-button" @click="deleteItem">
        <img class="delete-pic" src="/img/trash.svg" alt="delete item" />
      </button>
    </div>
    <div class="text-container">
      <div class="annotations">
        <h1>{{ item.heading }}</h1>
        <p>{{ item.price }} тг.</p>
      </div>
      <div class="delete">
        <div class="amount">
          <button @click="decrement"><span class="amount-text">-</span></button>
          <p>
            <span class="amount-text">{{ item.amount }}</span>
          </p>
          <button @click="increment"><span class="amount-text">+</span></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../assets/styles" as *;

.desktop {
  display: flex;
  padding: 25px;
  align-items: center;
  gap: 70px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.item-pic {
  width: 125px;
  height: 125px;
  flex-shrink: 0;
  border-radius: 100px;
  background: url(<path-to-image>), lightgray 50% / cover no-repeat;
  box-shadow: 0px 5px 25px 0px rgba(0, 0, 0, 0.25);
}

.annotations {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
}

h1 {
  align-self: stretch;
  color: $outline-clr;
  /* bigger-bold */
  @include bigger-bold($mobile: false);
}

p {
  align-self: stretch;
  color: $outline-clr;
  /* bigger-italic */
  @include bigger-italic($mobile: false);
}

.delete {
  display: flex;
  padding: 5px 0px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
}

.delete-pic {
  width: 36px;
  height: 36px;
}

.amount {
  display: flex;
  padding: 10px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 5px 9px -1px rgba(0, 0, 0, 0.05) inset;
}

.amount-text {
  color: $outline-clr;
  text-align: center;
  /* bigger-bold */
  @include bigger-bold($mobile: false);
}

.mobile {
  display: none;
}

@media screen and (max-width: $break-tablet) {
}

@media screen and (max-width: $break-mobile) {
  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
    padding: 25px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
    align-self: stretch;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .image-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
  }

  .text-container {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    align-self: stretch;
  }

  h1 {
    @include bigger-bold($mobile: true);
  }

  p {
    font-size: 1rem;
  }

  .amount-text {
    @include bigger-bold($mobile: true);
  }
}
</style>
