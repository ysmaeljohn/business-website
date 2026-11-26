import {products, checkMatchingProduct} from './products.js';
import {showCartToast} from './toast.js';
import {addToCart} from './cart.js';

const cartCountBadges = document.querySelectorAll('.cart-count-badge');
const cartLinks = document.querySelectorAll('.cart-icon, .site-header-icon-action');

function updateCartBadge() {
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const itemCount = cartItems.reduce((total, item) => total + Number(item.quantity), 0);
  const itemLabel = itemCount === 1 ? 'item' : 'items';

  cartCountBadges.forEach((badge) => {
    badge.textContent = String(itemCount);
    badge.hidden = itemCount === 0;
  });

  cartLinks.forEach((link) => {
    link.setAttribute('aria-label', `Shopping cart, ${itemCount} ${itemLabel}`);
  });
}

updateCartBadge();
window.addEventListener('cart:change', updateCartBadge);
window.addEventListener('storage', (event) => {
  if (event.key === 'cart') {
    updateCartBadge();
  }
});

let productsHTML = '';

products.forEach((productItem) => {
  productsHTML += `
    <div class="cards unique-${productItem.id}">
      <div class="img-container">
        <img type="image/png" title="${productItem.name}" src="${productItem.src}" class="product-img" alt="cookie image">
        <button title="add to favorites" class="fav-btn"></button>
      </div>
      <div class="description">
        <h2 class="product-title">${productItem.name}</h2>
        <p class="product-desc">${productItem.description}</p>
        <button class="cart-btn js-cart-btn" data-product-id="${productItem.id}">Add to Cart</button>
      </div>
    </div>
  `
})

document.querySelector('.products-container').innerHTML = productsHTML;

function renderAddToCartForm() {
  const addToCartBtn = document.querySelectorAll('.cart-btn');

  addToCartBtn.forEach((button) => {
    button.addEventListener('click', () => {
      const formElement = document.querySelector('.js-cart-form');
      formElement.style.display = 'flex';

      const productId = button.dataset.productId;

      const matchingProduct = checkMatchingProduct(productId);

      formElement.innerHTML = `
        <div class="modal-content">
          <button class="close-btn">x</button>
          <div class="modal-body">
            <img class="form-product-image" src="../${matchingProduct.src}" alt="Product">
            <div class="modal-details">
              <h2 class="form-product-title">${matchingProduct.name}</h2>
              <div class="price-label-container">
                  <p class="price-label">₱${(matchingProduct.price.fiftyGrams).toFixed(2)}</p>
              </div>
              
              <div id="cart-form">
                <div class="form-group">
                  <label for="quantity">Quantity:</label>
                  <input type="number" id="quantity" value="1" min="1" max="99">
                </div>

                <div class="form-group">
                  <label>Variation:</label>
                  <div class="variations">
                    <label class="variation-option">
                      <input data-grams="50g" type="radio" name="grams" value="${matchingProduct.price.fiftyGrams}" checked>
                      <span>50 grams</span>
                    </label>
                    <label class="variation-option">
                      <input data-grams="100g" type="radio" name="grams" value="${matchingProduct.price.hundredGrams}">
                      <span>100 grams</span>
                    </label>
                  </div>
                </div>

                <button class="confirm-cart-btn" data-product-id="${matchingProduct.id}">
                  Confirm Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const exitBtn = document.querySelector('.close-btn');

      exitBtn.addEventListener('click', () => {
        formElement.style.display = 'none';
      })

      // Handle Radio Buttons
      const radios = document.querySelectorAll('input[name="grams"]');
      const priceLabel = document.querySelector('.price-label');
      let price = 0;
      let quantityValue = 1;
      let totalPrice = 0;
      let category;

      radios.forEach(radio => {
        if (radio.checked) {
          price = Number(radio.value);
          totalPrice = Number(price * quantityValue);

          priceLabel.textContent = `₱${totalPrice.toFixed(2)}`;

          category = radio.dataset.grams;
        }
        
        radio.addEventListener('change', (event) => {
          if (event.target.checked) {
            price = Number(radio.value);
            totalPrice = Number(price * quantityValue);

            priceLabel.textContent = `₱${totalPrice.toFixed(2)}`;

            category = event.target.dataset.grams;
          }
        });
      })

      // Handle Quantity
      const quantityInput = document.getElementById('quantity');

      quantityInput.addEventListener('input', event => {
        const safeQuantity = Math.min(99, Math.max(1, Number(quantityInput.value) || 1));
        quantityValue = safeQuantity;

        totalPrice = Number(price * safeQuantity);

        priceLabel.textContent = `₱${totalPrice.toFixed(2)}`;
      })

      const confirmAddToCart = document.querySelector('.confirm-cart-btn');

      confirmAddToCart.addEventListener('click', () => {
        addToCart(productId, quantityValue, totalPrice, category);

        showCartToast(matchingProduct.name);
        formElement.style.display = 'none';
      });
    })
  })
}

renderAddToCartForm();