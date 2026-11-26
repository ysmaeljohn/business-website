export let cart = JSON.parse(localStorage.getItem('cart'))

if (!cart) {
  cart = [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart:change'));
}

export function addToCart(productId, quantity, price, category) {
  const matchingItem = cart.find(
    (item) => item.productId === productId && item.category === category
  );

  if (matchingItem) {
    matchingItem.quantity += quantity;
    matchingItem.price += price;
  } else {
    cart.push({
      productId,
      quantity,
      price,
      category
    })
  }
  console.log(matchingItem);
  saveToStorage();
}

export function updateCartQuantity(productId, category, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new RangeError('Quantity must be a whole number between 1 and 99.');
  }

  const matchingItem = cart.find(
    (item) => item.productId === productId && (item.category || 'Default') === category
  );

  if (!matchingItem) {
    throw new Error('The requested cart item could not be found.');
  }

  const unitPrice = Number(matchingItem.price) / Number(matchingItem.quantity);
  if (!Number.isFinite(unitPrice)) {
    throw new Error('The cart item has an invalid price or quantity.');
  }

  matchingItem.quantity = quantity;
  matchingItem.price = unitPrice * quantity;
  saveToStorage();

  return matchingItem.price;
}

export function removeFromCart(productId, category) {
  const itemIndex = cart.findIndex(
    (item) => item.productId === productId && (item.category || 'Default') === category
  );

  if (itemIndex === -1) {
    throw new Error('The requested cart item could not be found.');
  }

  cart.splice(itemIndex, 1);
  saveToStorage();
}

export function clearCart() {
  cart.length = 0;
  saveToStorage();
}

export function groupCartByProduct(cartItems) {
  return cartItems.reduce((groups, item) => {
    if (!groups[item.productId]) {
      groups[item.productId] = [];
    }
    groups[item.productId].push(item);
    return groups;
  }, {});
}