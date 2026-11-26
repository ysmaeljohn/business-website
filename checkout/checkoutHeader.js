import {cart} from '../cart.js';

export function renderCheckoutHeader() {
  const itemCount = cart.reduce((total, item) => total + Number(item.quantity), 0);
  const itemLabel = itemCount === 1 ? 'Item' : 'Items';
  const checkoutContext = itemCount === 0
    ? 'Cart is empty'
    : `${itemCount} ${itemLabel}`;

  const checkoutHeaderHTML = `
    <a class="site-brand" href="../" aria-label="Kukie home">
      <img src="../images/Kukie.png" alt="">
      <span>Kuki</span>
    </a>
    <div class="site-header-actions">
      <span class="site-header-context">Checkout · ${checkoutContext}</span>
      <a class="site-header-action" href="../delivery/delivery.html" aria-label="Track your orders">
        <span class="site-header-desktop-label">Track Order</span>
        <span class="site-header-mobile-label">Track</span>
      </a>
    </div>
  `;

  document.querySelector('.site-header-inner').innerHTML = checkoutHeaderHTML;
}
