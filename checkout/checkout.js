import { cart, addToCart, clearCart, removeFromCart, updateCartQuantity } from '../cart.js';
import { products, checkMatchingProduct } from '../products.js';
import { showCartToast } from '../toast.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

const deliveryOptions = [
  {
    id: 'free',
    label: 'FREE Shipping',
    shippingFee: 0,
    deliveryDate: dayjs().add(7, 'day').format('dddd, MMMM D')
  },
  {
    id: 'standard',
    label: '₱10 - Shipping',
    shippingFee: 10,
    deliveryDate: dayjs().add(4, 'day').format('dddd, MMMM D')
  },
  {
    id: 'express',
    label: '₱20 - Shipping',
    shippingFee: 20,
    deliveryDate: dayjs().add(1, 'day').format('dddd, MMMM D')
  }
];

function groupCartByProduct(cartItems) {
  return cartItems.reduce((groups, item) => {
    if (!groups[item.productId]) {
      groups[item.productId] = [];
    }
    groups[item.productId].push(item);
    return groups;
  }, {});
}

const deliveryOptionsContainer = document.querySelector('.js-delivery-options');
const deliveryDetailsForm = document.querySelector('#delivery-details-form');

deliveryDetailsForm.querySelectorAll('[data-letters-only]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[0-9]/g, '');
  });
});

deliveryDetailsForm.querySelectorAll('[data-digits-only]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
  });
});

deliveryDetailsForm.querySelectorAll('[data-phone-only]').forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9+() -]/g, '');
  });
});

function readDeliveryDetails(form) {
  const fieldValue = (name) => form.querySelector(`[name="${name}"]`).value.trim();

  return {
    fullName: fieldValue('fullName'),
    contactNumber: fieldValue('contactNumber'),
    address: {
      street: fieldValue('street'),
      barangay: fieldValue('barangay'),
      city: fieldValue('city'),
      province: fieldValue('province'),
      postalCode: fieldValue('postalCode')
    },
    deliveryInstructions: fieldValue('deliveryInstructions')
  };
}

deliveryOptionsContainer.innerHTML = `
  <div class="delivery-options-title">Choose a delivery option:</div>
  ${deliveryOptions.map((option, index) => `
    <label class="delivery-option">
      <input type="radio"
        class="delivery-option-input"
        name="order-delivery-option"
        value="${option.id}"
        data-delivery-date="${option.deliveryDate}"
        data-shipping-fee="${option.shippingFee}"
        ${index === 0 ? 'checked' : ''}>
      <span class="delivery-option-details">
        <span class="delivery-option-date">${option.deliveryDate}</span>
        <span class="delivery-option-price">${option.label}</span>
      </span>
    </label>
  `).join('')}
`;

const itemsCartContainer = document.querySelector('.items-cart-container');
const pageTitle = document.querySelector('.page-title');
const addCookieArea = document.querySelector('.add-cookie-area');
const checkoutGrid = document.querySelector('.checkout-grid');
const checkoutRightColumn = document.querySelector('.checkout-right-column');

function renderCartItems() {
  let cartSummaryHTML = '';
  const groupedCart = groupCartByProduct(cart);

  Object.entries(groupedCart).forEach(([productId, variants]) => {
    const matchingProduct = checkMatchingProduct(productId);
    if (!matchingProduct) return;

    const variantItemsHTML = variants.map((cartItem) => `
        <div class="cart-variant-item" data-product-id="${matchingProduct.id}" data-category="${cartItem.category || 'Default'}">
          <img class="product-image" src="../${matchingProduct.src}" alt="${matchingProduct.name}">
          <div class="cart-variant-info">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-category">
              Variation: ${cartItem.category || 'Default'}
            </div>
            <div class="product-price">
              ₱${Number(cartItem.price).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <button type="button"
                class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}"
                data-category="${cartItem.category || 'Default'}"
              >
                Update
              </button>
              <form class="quantity-edit-form" hidden
                data-product-id="${matchingProduct.id}"
                data-category="${cartItem.category || 'Default'}"
              >
                <input
                  class="quantity-input"
                  type="number"
                  min="1"
                  max="99"
                  step="1"
                  required
                  value="${cartItem.quantity}"
                  aria-label="Quantity for ${matchingProduct.name} (${cartItem.category || 'Default'})"
                >
                <button type="submit" class="save-quantity-button">Save</button>
              </form>
              <button type="button"
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}"
                data-category="${cartItem.category || 'Default'}"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
  `).join('');

    cartSummaryHTML += variantItemsHTML;
  });

  const hasCartItems = cart.length > 0;
  pageTitle.hidden = !hasCartItems;
  addCookieArea.hidden = !hasCartItems;
  checkoutGrid.classList.toggle('is-cart-empty', !hasCartItems);
  checkoutRightColumn.hidden = !hasCartItems;

  if (cartSummaryHTML === '') {
    itemsCartContainer.innerHTML = `
    <section class="empty-cart-state" aria-labelledby="empty-cart-title">
      <div class="empty-cart-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M11 14h5l5 27h27l6-20H19" />
          <path d="M25 51a2.5 2.5 0 1 0 0 .1M45 51a2.5 2.5 0 1 0 0 .1" />
          <path d="M25 28h20M28 34h15" />
        </svg>
      </div>
      <h2 id="empty-cart-title">Your cart is empty</h2>
      <p>There are no cookies in your cart yet. Browse our treats to find something you love.</p>
      <a class="empty-cart-action" href="../">Browse cookies</a>
    </section>
  `;
  } else {
    itemsCartContainer.innerHTML = cartSummaryHTML;
  }
}

function renderOrderSummary() {
  const itemCount = cart.reduce((total, item) => total + Number(item.quantity), 0);
  const itemsSubtotalCents = cart.reduce(
    (total, item) => total + Math.round(Number(item.price) * 100),
    0
  );
  const selectedDeliveryOption = document.querySelector('.delivery-option-input:checked');
  const shippingCents = Number(selectedDeliveryOption?.dataset.shippingFee || 0) * 100;
  const orderTotalCents = itemsSubtotalCents + shippingCents;
  const formatPeso = (amountInCents) => `₱${(amountInCents / 100).toFixed(2)}`;

  document.querySelector('.js-summary-item-count').textContent = `Items (${itemCount}):`;
  document.querySelector('.js-summary-items').textContent = formatPeso(itemsSubtotalCents);
  document.querySelector('.js-summary-shipping').textContent = formatPeso(shippingCents);
  document.querySelector('.js-summary-total').textContent = formatPeso(orderTotalCents);
  document.querySelector('.place-order-button').disabled = itemCount === 0;
}

const addCookieTrigger = document.querySelector('.js-add-cookie-trigger');
const addCookieForm = document.querySelector('.js-add-cookie-form');
const addCookieProduct = document.querySelector('#add-cookie-product');
const addCookieQuantity = document.querySelector('#add-cookie-quantity');
const addCookieTotal = document.querySelector('.js-add-cookie-total');

products.forEach((product) => {
  addCookieProduct.add(new Option(product.name, product.id));
});

function updateAddCookieTotal() {
  const product = checkMatchingProduct(addCookieProduct.value);
  const selectedSize = addCookieForm.querySelector('input[name="add-cookie-size"]:checked');

  if (!product || !selectedSize) {
    throw new Error('Select a valid cookie flavor and size.');
  }

  const unitPrice = selectedSize.value === '50g'
    ? product.price.fiftyGrams
    : product.price.hundredGrams;
  const quantity = Math.min(99, Math.max(1, Number(addCookieQuantity.value) || 1));
  addCookieTotal.textContent = `₱${(unitPrice * quantity).toFixed(2)}`;
}

addCookieTrigger.addEventListener('click', () => {
  addCookieForm.hidden = !addCookieForm.hidden;
  addCookieTrigger.setAttribute('aria-expanded', String(!addCookieForm.hidden));

  if (!addCookieForm.hidden) addCookieProduct.focus();
});

document.querySelector('.js-add-cookie-cancel').addEventListener('click', () => {
  addCookieForm.hidden = true;
  addCookieTrigger.setAttribute('aria-expanded', 'false');
  addCookieTrigger.focus();
});

addCookieProduct.addEventListener('change', updateAddCookieTotal);
addCookieQuantity.addEventListener('input', updateAddCookieTotal);
addCookieForm.querySelectorAll('input[name="add-cookie-size"]').forEach((input) => {
  input.addEventListener('change', updateAddCookieTotal);
});

addCookieForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!addCookieForm.reportValidity()) return;

  const product = checkMatchingProduct(addCookieProduct.value);
  const selectedSize = addCookieForm.querySelector('input[name="add-cookie-size"]:checked');
  if (!product || !selectedSize) {
    throw new Error('Select a valid cookie flavor and size.');
  }

  const quantity = addCookieQuantity.valueAsNumber;
  const unitPrice = selectedSize.value === '50g'
    ? product.price.fiftyGrams
    : product.price.hundredGrams;

  addToCart(product.id, quantity, unitPrice * quantity, selectedSize.value);
  renderCartItems();
  renderOrderSummary();
  renderCheckoutHeader();
  showCartToast(product.name);

  addCookieForm.reset();
  updateAddCookieTotal();
  addCookieForm.hidden = true;
  addCookieTrigger.setAttribute('aria-expanded', 'false');
  addCookieTrigger.focus();
});

function saveOrderForTracking(itemCount, deliveryDetails) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  if (!Array.isArray(orders)) {
    throw new TypeError('Saved orders must be a list.');
  }

  const selectedOption = document.querySelector('.delivery-option-input:checked');
  const deliveryOption = deliveryOptions.find((option) => option.id === selectedOption?.value);
  if (!deliveryOption) {
    throw new Error('Select a valid delivery option before placing the order.');
  }

  const selectedPaymentMethod = document.querySelector('input[name="order-payment-method"]:checked');
  if (!selectedPaymentMethod) {
    throw new Error('Select a payment method before placing the order.');
  }

  const order = {
    status: 'processing',
    placedAt: new Date().toISOString(),
    itemCount,
    total: document.querySelector('.js-summary-total').textContent,
    paymentMethod: selectedPaymentMethod.value,
    deliveryOption: {
      id: deliveryOption.id,
      label: deliveryOption.label,
      deliveryDate: deliveryOption.deliveryDate,
      shippingFee: deliveryOption.shippingFee
    },
    deliveryDetails,
    items: cart.map((item) => ({
      productId: item.productId,
      category: item.category || 'Default',
      quantity: Number(item.quantity),
      price: Number(item.price)
    }))
  };

  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

itemsCartContainer.addEventListener('click', (event) => {
  const updateButton = event.target.closest('.js-update-link');
  if (updateButton) {
    const form = updateButton.parentElement.querySelector('.quantity-edit-form');
    const quantityInput = form.querySelector('.quantity-input');

    updateButton.hidden = true;
    form.hidden = false;
    quantityInput.focus();
    return;
  }

  const deleteButton = event.target.closest('.js-delete-link');
  if (deleteButton) {
    removeFromCart(deleteButton.dataset.productId, deleteButton.dataset.category || 'Default');
    renderCartItems();
    renderOrderSummary();
    renderCheckoutHeader();
  }
});

itemsCartContainer.addEventListener('submit', (event) => {
  const form = event.target;
  if (!form.matches('.quantity-edit-form')) return;

  event.preventDefault();
  const quantityInput = form.querySelector('.quantity-input');
  if (!quantityInput.reportValidity()) return;

  const quantity = quantityInput.valueAsNumber;
  const productId = form.dataset.productId;
  const category = form.dataset.category || 'Default';
  const updatedPrice = updateCartQuantity(productId, category, quantity);
  const variantElement = form.closest('.cart-variant-item');
  const updateButton = form.parentElement.querySelector('.js-update-link');

  variantElement.querySelector('.quantity-label').textContent = String(quantity);
  variantElement.querySelector('.product-price').textContent = `₱${updatedPrice.toFixed(2)}`;
  renderOrderSummary();
  renderCheckoutHeader();
  form.hidden = true;
  updateButton.hidden = false;
  updateButton.focus();
});

document.querySelectorAll('.delivery-option-input').forEach((radio) => {
  radio.addEventListener('change', () => {
    renderOrderSummary();
  });
});

document.querySelector('.place-order-button').addEventListener('click', (event) => {
  const itemCount = cart.reduce((total, item) => total + Number(item.quantity), 0);
  if (itemCount === 0) return;

  if (!deliveryDetailsForm.reportValidity()) return;

  const deliveryDetails = readDeliveryDetails(deliveryDetailsForm);
  saveOrderForTracking(itemCount, deliveryDetails);
  event.currentTarget.disabled = true;
  clearCart();
  window.location.assign('../delivery/delivery.html');
});

renderCartItems();
updateAddCookieTotal();
renderCheckoutHeader();
renderOrderSummary();