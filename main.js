import {productsFiftyGrams} from '/products.js';

let productsHTML = '';

productsFiftyGrams.forEach((productItem) => {
  productsHTML += `
    <div class="cards unique-${productItem.id}">
      <div class="img-container">
        <img type="image/png" title="${productItem.name}" src="${productItem.src}" class="product-img" alt="cookie image">
        <button title="add to favorites" class="fav-btn"></button>
      </div>
      <div class="description">
        <h2 class="product-title">${productItem.name}</h2>
        <p class="product-desc">Freshly baked chewy chocolate chip cookie loaded with rich, premium chocolate chunks.</p>
        <button class="add-to-cart-btn" data-button-id=${productItem.id}>Add to Cart</button>
      </div>
    </div>
  `
})

document.querySelector('.products-container').innerHTML = productsHTML;

const addToCartBtn = document.querySelectorAll('.add-to-cart-btn');
const cartCard = document.querySelector('.cart-form');
const closeCart = document.querySelectorAll('.close-btn');

addToCartBtn.forEach((button) => {
  button.addEventListener('click', () => {
    cartCard.style.display = 'flex';

    const productId = button.dataset.buttonId
    const currentCard = document.querySelector(`.unique-${productId}`);
    const name = currentCard.querySelector('.product-title').textContent;
    const img = currentCard.querySelector('.product-img').src;
    const description = currentCard.querySelector('.product-desc').textContent;

    document.querySelector('.form-product-title').textContent = name;
    document.querySelector('.form-product-image').src = img;
    document.querySelector('.form-product-desc').textContent = description;
  })
});

closeCart.forEach((button) => {
  button.addEventListener('click', () => {
    cartCard.style.display = 'none';
  })
})