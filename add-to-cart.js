const modal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-btn');
const cartForm = document.getElementById('cart-form');

let activeProduct = null;

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.cards');

    const name = card.querySelector('.product-title').textContent;
    const description = card.querySelector('.product-desc').textContent;
    const image = card.querySelector('.product-img').src;

    activeProduct = { name, description, image };

    document.getElementById('modal-title').textContent = name;
    document.getElementById('modal-desc').textContent = description;
    document.getElementById('modal-img').src = image;
    document.getElementById('quantity').value = 1;

    modal.style.display = 'flex';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

cartForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const quantity = document.getElementById('quantity').value;
  const selectedColor = document.querySelector('input[name="color"]:checked').value;

  const cartItem = {
    name: activeProduct.name,
    quantity: parseInt(quantity),
    color: selectedColor,
    image: activeProduct.image
  };

  // Save to cart in localStorage
  let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
  cart.push(cartItem);
  localStorage.setItem('user_cart', JSON.stringify(cart));

  alert(`Added ${quantity}x ${activeProduct.name} (${selectedColor}) to your cart!`);
  
  modal.style.display = 'none';
});