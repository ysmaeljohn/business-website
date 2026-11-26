export function showCartToast(itemName = 'Item') {
  showToast(itemName, 'added to cart');
}

export function showMessageToast(message, onDismiss) {
  return showToast(message, '', onDismiss);
}

function showToast(title, detail, onDismiss) {
  const container = document.querySelector('.toast-container');
  if (!container) return false;

  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.setAttribute('role', 'status');

  toast.innerHTML = `
    <span class="cart-toast-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <div class="cart-toast-text">
      <strong>${escapeHtml(title)}</strong>
      ${detail ? `<span>${escapeHtml(detail)}</span>` : ''}
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
      if (onDismiss) onDismiss();
    }, 250);
  }, 2500);

  return true;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}