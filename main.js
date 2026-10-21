import {productsFiftyGrams} from '/products.js';

let productsHTML = ``;

productsFiftyGrams.forEach((productItem) => {
  productsHTML += `
     <div class="cards">
        <div class="img-container">
          <img type="image/png" title="${productItem.name}" src="${productItem.src}" class="product-img" alt="cookie image">
          <button title="add to favorites" class="fav-btn"></button>
        </div>
        <div class="description">
          <h2 class="product-title">${productItem.name}</h2>
          <p class="product-desc">Freshly baked chewy chocolate chip cookie loaded with rich, premium chocolate chunks.</p>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
  `
})

document.querySelector('.products-container').innerHTML = productsHTML;